import {
  DeleteNoteButton,
  NewNoteButton,
  SettingsButton,
  ChatButton,
  // LeftBarHideButton,
} from "@/components";
import { ComponentProps } from "react";

export const ActionButtonsRow = (props: ComponentProps<"div">) => {
  return (
    <div {...props}>
      <NewNoteButton />
      <DeleteNoteButton />
      <ChatButton />
      <SettingsButton />
      {/* <LeftBarHideButton /> */}
    </div>
  );
};
