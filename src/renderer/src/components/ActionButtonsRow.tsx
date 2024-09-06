import {
  DeleteNoteButton,
  NewNoteButton,
  SettingsButton,
  ChatButton,
} from "@/components";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import { ComponentProps } from "react";

export const ActionButtonsRow = (props: ComponentProps<"div">) => {
  return (
    <div {...props}>
      <NewNoteButton />
      <DeleteNoteButton />
      <ChatButton />
      <SettingsButton />
    </div>
  );
};
