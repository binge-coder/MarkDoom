import { showChatAtom } from "@renderer/store";
import { ComponentProps } from "react";
import { SidebarHideButton } from "./SidebarHideButton";

type Props = ComponentProps<"button">;

export const RightBarHideButton = (props: Props) => {
  return (
    <SidebarHideButton stateAtom={showChatAtom} isRightSide={true} {...props} />
  );
};
