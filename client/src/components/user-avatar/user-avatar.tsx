import React from "react";
import { Avatar } from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";

interface UserAvatarProps {
  src?: string;
  className?: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ src, className }) => {
  return src ? <Avatar className={className} src={src} /> : <AccountCircle />;
};

export default UserAvatar;
