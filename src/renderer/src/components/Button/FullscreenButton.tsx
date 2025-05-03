import { ActionButton, ActionButtonProps } from "@/components";
import { useCallback, useEffect, useState } from "react";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";

// Renamed component to ZenModeButton
export const ZenModeButton = (props: ActionButtonProps) => {
  const [isZenMode, setIsZenMode] = useState(false);

  // Update state when fullscreen changes from elsewhere (like F11 key)
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsZenMode(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const toggleZenMode = useCallback(async () => {
    try {
      await window.context.toggleZenMode();
    } catch (err) {
      console.error("Failed to toggle Zen Mode:", err);
    }
  }, []);

  return (
    <ActionButton onClick={toggleZenMode} title={"Zen Mode"} {...props}>
      {isZenMode ? (
        <RxExitFullScreen className="h-5 w-5" />
      ) : (
        <RxEnterFullScreen className="h-5 w-5" />
      )}
    </ActionButton>
  );
};
