import { ActionButton, ActionButtonProps } from "@/components";
import { themeAtom } from "@renderer/store";
import { useAtomValue } from "jotai";
import { Maximize2, Minimize2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export const ZenModeButton = (props: ActionButtonProps) => {
  const [isZenMode, setIsZenMode] = useState(false);
  const theme = useAtomValue(themeAtom);
  const isLightMode = theme === "light";

  // Update state when zen mode changes from elsewhere (like F11 key)
  useEffect(() => {
    const handleZenModeChange = () => {
      setIsZenMode(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleZenModeChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleZenModeChange);
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
        <Minimize2
          className={`h-5 w-5 ${isLightMode ? "text-slate-700" : "text-white/70"}`}
        />
      ) : (
        <Maximize2
          className={`h-5 w-5 ${isLightMode ? "text-slate-700" : "text-white/70"}`}
        />
      )}
    </ActionButton>
  );
};
