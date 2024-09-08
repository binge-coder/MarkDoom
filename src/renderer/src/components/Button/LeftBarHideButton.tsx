import { ActionButton } from "@/components";
import { useAtom } from "jotai";
import { showLeftSideBarAtom } from "@renderer/store";
import { FaAngleLeft } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";
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
    >
      {showLeftSideBar ? (
        <FaAngleLeft className="h-5 w-5" />
      ) : (
        <FaAngleRight className="h-5 w-5" />
      )}
    </ActionButton>
  );
};
