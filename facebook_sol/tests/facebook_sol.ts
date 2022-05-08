import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { FacebookSol } from "../target/types/facebook_sol";

describe("./facebook_sol", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.FacebookSol as Program<FacebookSol>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});
