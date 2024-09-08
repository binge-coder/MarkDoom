import { ActionButton } from "@/components";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
import { ComponentProps } from "react";
import { useAtom } from "jotai";
import { showChatAtom } from "@renderer/store";

type Props = ComponentProps<typeof ActionButton>;

export const RightBarHideButton = (props: Props) => {
  const [showRightSideBar, setShowRightSideBar] = useAtom(showChatAtom);

  return (
    <ActionButton
      onClick={() => {
        setShowRightSideBar((prev) => !prev);
      }}
      {...props}
      className={props.className}
    >
      {showRightSideBar ? (
        <FaAngleRight className="h-5 w-5" />
      ) : (
        <FaAngleLeft className="h-5 w-5" />
      )}
    </ActionButton>
  );
};
