import React from "react";
import { Avatar } from "@material-ui/core";

interface UserAvatarProps {
  src?: string;
  className?: string;
  alt?: string;
  imgProps?: React.ImgHTMLAttributes<HTMLImageElement>;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  alt,
  className,
  imgProps,
}) => {
  return (
    <Avatar className={className} src={src} alt={alt} imgProps={imgProps} />
  );
};

export default UserAvatar;
