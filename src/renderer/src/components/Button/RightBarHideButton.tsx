import { ActionButton } from "@/components";
import { showChatAtom } from "@renderer/store";
import { useAtom } from "jotai";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentProps } from "react";

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
        <ChevronRight className="h-5 w-5" />
      ) : (
        <ChevronLeft className="h-5 w-5" />
      )}
    </ActionButton>
  );
};
