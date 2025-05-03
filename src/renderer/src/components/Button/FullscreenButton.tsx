import { ActionButton, ActionButtonProps } from "@/components";
import { useCallback, useEffect, useState } from "react";
import { RxEnterFullScreen, RxExitFullScreen } from "react-icons/rx";

export const FullscreenButton = (props: ActionButtonProps) => {
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Update state when fullscreen changes from elsewhere (like F11 key)
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);
        return () => {
            document.removeEventListener("fullscreenchange", handleFullscreenChange);
        };
    }, []);

    const toggleFullscreen = useCallback(async () => {
        try {
            await window.context.toggleFullscreen();
        } catch (err) {
            console.error("Failed to toggle fullscreen:", err);
        }
    }, []);

    return (
        <ActionButton
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit fullscreen mode" : "Enter fullscreen mode"}
            {...props}
        >
            {isFullscreen ? (
                <RxExitFullScreen className="h-5 w-5" />
            ) : (
                <RxEnterFullScreen className="h-5 w-5" />
            )}
        </ActionButton>
    );
};
