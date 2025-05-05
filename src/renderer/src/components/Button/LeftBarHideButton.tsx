import { showLeftSideBarAtom } from "@renderer/store";
import { ComponentProps } from "react";
import { SidebarHideButton } from "./SidebarHideButton";

type Props = ComponentProps<"button">;

export const LeftBarHideButton = (props: Props) => {
  return <SidebarHideButton stateAtom={showLeftSideBarAtom} {...props} />;
};
