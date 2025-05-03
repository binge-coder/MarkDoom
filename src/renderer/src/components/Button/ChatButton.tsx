import { ActionButton, ActionButtonProps } from "@/components";
import { useSetAtom } from "jotai";
import { showChatAtom } from "@renderer/store";
// import { SiGooglechat } from "react-icons/si";
// import { SiGooglebard } from "react-icons/si";
import { FaRobot } from "react-icons/fa6";

export const ChatButton = (...props: ActionButtonProps[]) => {
  const setShowSettings = useSetAtom(showChatAtom);
  const handleChatToggle = () => {
    setShowSettings((prev) => !prev);
  };
  return (
    <ActionButton onClick={handleChatToggle} title={"AI Assistant"} {...props}>
      <FaRobot className="h-5 w-5" />
      {/* <SiGooglebard className="h-5 w-5" /> */}
    </ActionButton>
  );
};
