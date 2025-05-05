import { ActionButton, ActionButtonProps } from "@/components";
import { showSettingsAtom, themeAtom } from "@renderer/store";
import { useAtomValue, useSetAtom } from "jotai";
import { Settings } from "lucide-react";

export const SettingsButton = (...props: ActionButtonProps[]) => {
  const setShowSettings = useSetAtom(showSettingsAtom);
  const theme = useAtomValue(themeAtom);
  const isLightMode = theme === "light";

  const handleSettingsToggle = () => {
    setShowSettings((prev) => !prev);
  };

  return (
    <ActionButton onClick={handleSettingsToggle} title={"Settings"} {...props}>
      <Settings
        className={`h-5 w-5 ${isLightMode ? "text-slate-700" : "text-white/70"}`}
      />
    </ActionButton>
  );
};
