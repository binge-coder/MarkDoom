import { ActionButton, ActionButtonProps } from "@/components";
import { useSetAtom } from "jotai";
import { showSettingsAtom } from "@renderer/store";
import { IoMdSettings } from "react-icons/io";

export const SettingsButton = (...props: ActionButtonProps[]) => {
  const setShowSettings = useSetAtom(showSettingsAtom);
  const handleSettingsToggle = () => {
    setShowSettings((prev) => !prev);
  };
  return (
    <ActionButton onClick={handleSettingsToggle} title={"Settings"} {...props}>
      <IoMdSettings className="h-5 w-5" />
    </ActionButton>
  );
};
