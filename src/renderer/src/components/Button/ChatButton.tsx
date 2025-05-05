import { ActionButton, ActionButtonProps } from "@/components";
import { showChatAtom, themeAtom } from "@renderer/store";
import { cn } from "@renderer/utils";
import { useAtomValue, useSetAtom } from "jotai";
import { Bot } from "lucide-react";

export const ChatButton = (...props: ActionButtonProps[]) => {
  const setShowChat = useSetAtom(showChatAtom);
  const theme = useAtomValue(themeAtom);
  const isLightMode = theme === "light";

  const handleChatToggle = () => {
    setShowChat((prev) => !prev);
  };

  return (
    <ActionButton onClick={handleChatToggle} title={"AI Assistant"} {...props}>
      <Bot
        className={cn(
          "h-5 w-5",
          isLightMode ? "text-slate-600" : "text-slate-300",
        )}
      />
    </ActionButton>
  );
};
