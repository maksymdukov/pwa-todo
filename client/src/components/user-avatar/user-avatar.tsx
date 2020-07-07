import React from "react";
import { Avatar } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";

interface UserAvatarProps {
  src?: string;
  className?: string;
  fallbackClassname?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
  src,
  className,
  fallbackClassname,
}) => {
  return src ? (
    <Avatar
      className={className}
      src={src}
      imgProps={{ crossOrigin: "anonymous" }}
    />
  ) : (
    <AccountCircle className={fallbackClassname} />
  );
};

export default UserAvatar;
