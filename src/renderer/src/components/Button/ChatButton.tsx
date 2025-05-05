import { ActionButton, ActionButtonProps } from "@/components";
import { showChatAtom, themeAtom } from "@renderer/store";
import { useAtomValue, useSetAtom } from "jotai";
import { Bot } from "lucide-react";

export const ChatButton = (...props: ActionButtonProps[]) => {
  const setShowSettings = useSetAtom(showChatAtom);
  const theme = useAtomValue(themeAtom);
  const isLightMode = theme === "light";

  const handleChatToggle = () => {
    setShowSettings((prev) => !prev);
  };

  return (
    <ActionButton onClick={handleChatToggle} title={"AI Assistant"} {...props}>
      <Bot
        className={`h-5 w-5 ${isLightMode ? "text-slate-700" : "text-white/70"}`}
      />
    </ActionButton>
  );
};
