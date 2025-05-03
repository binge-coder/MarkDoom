import { ActionButton, ActionButtonProps } from "@/components";
import { showSettingsAtom } from "@renderer/store";
import { useSetAtom } from "jotai";
import { Settings } from "lucide-react";

export const SettingsButton = (...props: ActionButtonProps[]) => {
  const setShowSettings = useSetAtom(showSettingsAtom);
  const handleSettingsToggle = () => {
    setShowSettings((prev) => !prev);
  };
  return (
    <ActionButton onClick={handleSettingsToggle} title={"Settings"} {...props}>
      <Settings className="h-5 w-5" />
    </ActionButton>
  );
};
