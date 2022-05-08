import React from "react";
import Image from "next/image";

const style = {
  wrapper: `flex flex-col p-4 justify-center items-center h-full w-full bg-[#252526] w-min h-min rounded-2xl`,
  title: `text-[#afb3b8] font-semibold text-lg`,
  form: `flex flex-col items-center`,
  fieldContainer: `my-4 `,
  inputTitle: `text-[#afb3b8] font-semibold mb-2 ml-3`,
  inputContainer: `flex items-center w-[20rem] bg-[#3a3b3d] rounded-full`,
  inputField: `bg-transparent flex-1 m-2 outline-none text-white px-2`,
  randomUrl: `h-full bg-[#2d2d2d] hover:bg-[#252626] text-white px-2 py-1 mx-1 hover:px-3 rounded-full cursor-pointer duration-[0.2s] ease-in-out`,
  submitButton: `bg-[#3a3b3d] text-white font-semibold px-4 py-2 hover:px-6 rounded-full cursor-pointer duration-[0.2s] ease-in-out`,
};

const Signup = ({ name, url, setName, setUrl, setRegistered }) => {
  const generateRandomProfileImageUrl = () => null;

  const createUser = (event) => {
    event.preventDefault();
    setRegistered(true);
  };

  return (
    <div className={style.wrapper}>
      <div className={style.logoContainer}>
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/b/b9/Solana_logo.png"
          height={40}
          width={40}
          alt="solbook logo"
        />
      </div>
      <div className={style.title}>Sign up to Solbook today</div>
      <form
        onSubmit={(event) => {
          createUser(event);
        }}
        className={style.form}
      >
        <div className={style.fieldContainer}>
          <div className={style.inputTitle}>Name</div>
          <div className={style.inputContainer}>
            <input
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className={style.inputField}
            />
          </div>
        </div>
        <div className={style.fieldContainer}>
          <div className={style.inputTitle}>Profile Picture URL</div>
          <div className={style.inputContainer}>
            <input
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              required
              className={style.inputField}
            />
            <div
              className={style.randomUrl}
              onClick={() => generateRandomProfileImageUrl()}
            >
              Random
            </div>
          </div>
        </div>
        <button className={style.submitButton} type="submit">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
