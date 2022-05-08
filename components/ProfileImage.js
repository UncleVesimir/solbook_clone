import React from "react";
import Image from "next/image";

const ProfileImage = ({ imgUrl }) => {
  const style = {
    profileImageContainer: `object-cover mr-2`,
    profileImage: `rounded-full`,
  };

  return (
    <div className={style.profileImageContainer}>
      <Image
        className={style.profileImage}
        src={imgUrl}
        height={40}
        width={40}
      />
    </div>
  );
};

export default ProfileImage;
