import React, {useState}from "react";
import Image from 'next/image'
import { MdInsertEmoticon } from 'react-icons/md'
import { TiCameraOutline } from 'react-icons/ti'
import { RiFileGifLine } from 'react-icons/ri'
import { BiSticker } from 'react-icons/bi'

//Import Components
import ProfileImage from "./ProfileImage";

const CreateComment = ({createCommentForPost, name, url}) => {
  const style = {
    wrapper: `flex items-center`,
    profileImage: `rounded-full`,
    inputContainer: `flex flex-1 h-10 bg-[#3a3b3c] rounded-full px-[1rem]`,
    form: `flex flex-1 items-center`,
    input: `w-full bg-transparent outline-none`,
    inputIcons: `flex items-center gap-[0.4rem]`,
    icon: `cursor-pointer text-[#a6a9ae]`,
  }

  const [input, setInput] = useState('')


  const postComment = event => {
    event.preventDefault()

    await createCommentForPost(input)
    setInput('');
  }


  return (<div className={style.wrapper}>
    <ProfileImage imgUrl={url} />
  </div>);
};

export default CreateComment;
