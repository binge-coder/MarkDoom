import { ActionButton } from "@/components";
import { showLeftSideBarAtom } from "@renderer/store";
import { useAtom } from "jotai";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ComponentProps } from "react";

type Props = ComponentProps<typeof ActionButton>;

export const LeftBarHideButton = (props: Props) => {
  const [showLeftSideBar, setShowLeftSideBar] = useAtom(showLeftSideBarAtom);

  return (
    <ActionButton
      onClick={() => {
        setShowLeftSideBar((prev) => !prev);
      }}
      {...props}
      className={props.className}
    >
      {showLeftSideBar ? (
        <ChevronLeft className="h-5 w-5" />
      ) : (
        <ChevronRight className="h-5 w-5" />
      )}
    </ActionButton>
  );
};
