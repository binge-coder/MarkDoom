import { ActionButton, ActionButtonProps } from "@/components";
import { showChatAtom } from "@renderer/store";
import { useSetAtom } from "jotai";
import { Bot } from "lucide-react";

export const ChatButton = (...props: ActionButtonProps[]) => {
  const setShowSettings = useSetAtom(showChatAtom);
  const handleChatToggle = () => {
    setShowSettings((prev) => !prev);
  };
  return (
    <ActionButton onClick={handleChatToggle} title={"AI Assistant"} {...props}>
      <Bot className="h-5 w-5" />
    </ActionButton>
  );
};
