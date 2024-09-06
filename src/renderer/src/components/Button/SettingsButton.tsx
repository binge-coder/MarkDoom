import React from "react";
import { ActionButton, ActionButtonProps } from "@/components";

type SettingsButtonProps = {
  onClick: () => void;
};

const SettingsButton: React.FC<SettingsButtonProps> = ({ onClick }) => {
  return <ActionButton onClick={onClick}>Settings</ActionButton>;
};

export default SettingsButton;
