import React from "react";
import Image from "next/image";

const ProfileImage = ({ imgUrl, alt }) => {
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
        alt={alt || ""}
      />
    </div>
  );
};

export default ProfileImage;
