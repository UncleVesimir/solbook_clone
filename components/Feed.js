import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { useWallet } from "@solana/wallet-adapter-react";
import { SOLANA_HOST } from "../utils/const";
import { getProgramInstance } from "../utils/get-program";
import * as anchor from "@project-serum/anchor";

import CreatePost from "./CreatePost";
import Post from "./Post";

const { BN, web3 } = anchor;
const utf8 = anchor.utils.bytes.utf8;
const { SystemProgram } = web3;

const defaultAccount = {
  tokenProgram: TOKEN_PROGRAM_ID,
  clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
  systemProgram: SystemProgram.programId,
};

const Feed = ({ connected, name, url }) => {
  const style = {
    wrapper: `flex-1 max-w-2xl mx-4`,
  };

  // Init program instance
  const wallet = useWallet();
  const connection = new anchor.web3.Connection(SOLANA_HOST);
  const program = getProgramInstance(connection, wallet);

  //Init State

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllPosts = async () => {
    try {
      const postsData = await program.account.postAccount.all();

      postsData.sort(
        (a, b) => b.account.postTime.toNumber() - a.account.postTime.toNumber()
      );

      console.log(postsData);

      setPosts(postsData);

      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const getCommentsonPost = async (index, oldPost) => {
    let [postSigner] = await anchor.web3.PublicKey.findProgramAddress([
      utf8.encode("post"),
      BN.toArrayLike(index, "be", 8),
    ]);

    try {
      let post = program.accounts.postAccount.fetch(postSigner);
    } catch (error) {}
  };

  const savePost = async (text) => {
    //finds a VALID (i.e. correct and unoccupied) program address available on the network
    let [stateSigner] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode("state")],
      program.programId
    );

    let stateInfo;

    try {
      //checks to see if the valid address returns an EXISTING account.
      stateInfo = await program.account.stateAccount.fetch(stateSigner);
    } catch (error) {
      //if not, it creates one here.
      console.error(error);
      console.log("createState catch block");
      program.methods
        .createState()
        .accounts({
          state: stateSigner,
          authority: wallet.publicKey,
          ...defaultAccount,
        })
        .rpc();

      return;
    }

    //pattern seems to be "call for address of program/controller that manages account at X"
    //where X is a combination of the seed structure in lib.rs + overall program id"
    // NOTE: the controller here isn't just a text string of the address, but an objecti,
    // with values and methods on it https://project-serum.github.io/anchor/ts/classes/web3.PublicKey.html#default

    let [postSigner] = await anchor.web3.PublicKey.findProgramAddress(
      [utf8.encode("post"), stateInfo.postCount.toArrayLike(Buffer, "be", 8)],
      program.programId
    );

    try {
      await program.account.postAccount.fetch(postSigner);
    } catch (error) {
      try {
        await program.methods
          .createPost(text, name, url)
          .accounts({
            state: stateSigner,
            post: postSigner,
            authority: wallet.publicKey,
            ...defaultAccount,
          })
          .rpc();
      } catch (error) {
        console.error(error);
      }

      console.log(tx);
    }
    setPosts(await program.account.postAccount.all());
  };

  return (
    <div className={style.wrapper}>
      <Toaster postion="bottom-left" reverseOrder={false} />
      <div>
        {loading ? (
          <div> Loading... </div>
        ) : (
          <div>
            <CreatePost
              savePost={savePost}
              getAllPosts={getAllPosts}
              name={name}
              url={url}
            />

            {posts.map((post) => {
              return (
                <Post
                  post={post.account}
                  // viewDetail={getCommentsOnPost}
                  // createComment={saveComment}
                  key={post.account.index}
                  name={name}
                  url={url}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
