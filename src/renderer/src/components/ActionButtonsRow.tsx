import {
  // ChatButton,
  // DeleteNoteButton,
  NewNoteButton,
  SettingsButton,
  ZenModeButton, // Changed from FullscreenButton to ZenModeButton
} from "@/components";
import { ComponentProps } from "react";

export const ActionButtonsRow = (props: ComponentProps<"div">) => {
  return (
    <div {...props}>
      <NewNoteButton />
      {/* <DeleteNoteButton /> */}
      {/* <ChatButton /> */}
      <SettingsButton />
      <ZenModeButton /> {/* Changed from FullscreenButton to ZenModeButton */}
    </div>
  );
};
