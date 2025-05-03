import {
  ChatButton,
  DeleteNoteButton,
  FullscreenButton,
  NewNoteButton,
  SettingsButton,
} from "@/components";
import { ComponentProps } from "react";

export const ActionButtonsRow = (props: ComponentProps<"div">) => {
  return (
    <div {...props}>
      <NewNoteButton />
      <DeleteNoteButton />
      <ChatButton />
      <SettingsButton />
      <FullscreenButton />
      {/* <LeftBarHideButton /> */}
    </div>
  );
};
