import {
  ActionButtonsRow,
  ChatComponent,
  Content,
  FloatingNoteTitle,
  MarkdownEditor,
  NotePreviewList,
  PreferencesPage,
  RootLayout,
  Sidebar,
} from "@/components";
import { geminiApiKeyAtom } from "@/components/PreferencesPage";
import {
  initializeThemeFromSettings,
  showChatAtom,
  showLeftSideBarAtom,
  showSettingsAtom,
  themeAtom,
} from "@/store";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";

const App = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0);
  };

  const [showChat] = useAtom(showChatAtom);
  const [showSettings, setShowSettings] = useAtom(showSettingsAtom);
  const showLeftSideBar = useAtomValue(showLeftSideBarAtom);
  const setGeminiApiKey = useSetAtom(geminiApiKeyAtom);
  const [theme, setTheme] = useAtom(themeAtom);

  // Load settings on app start
  useEffect(() => {
    // Load settings during initial app load
    const loadSettings = async () => {
      const settings = await window.context.getSettings();
      if (settings.geminiApi) {
        setGeminiApiKey(settings.geminiApi);
      }
      // Initialize theme using the new helper function
      await initializeThemeFromSettings(setTheme);
    };
    loadSettings();

    // Set up listener for API key updates from other components
    const handleApiKeyUpdate = (event: CustomEvent) => {
      setGeminiApiKey(event.detail.apiKey);
    };

    window.addEventListener(
      "update-gemini-api-key",
      handleApiKeyUpdate as EventListener,
    );

    return () => {
      window.removeEventListener(
        "update-gemini-api-key",
        handleApiKeyUpdate as EventListener,
      );
    };
  }, [setGeminiApiKey, setTheme]);

  // Apply theme class to html element
  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.add("light-theme");
    } else {
      document.documentElement.classList.remove("light-theme");
    }
  }, [theme]);

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <RootLayout className={theme === "light" ? "light-mode" : "dark-mode"}>
      <PreferencesPage isVisible={showSettings} onClose={handleCloseSettings} />

      <Sidebar
        className={`${theme === "light" ? "bg-slate-200/40" : "bg-slate-800/40"} transform ${showLeftSideBar ? "translate-x-0 w-[250px] p-2" : "-translate-x-full w-0 p-0"} transition-all duration-200 ease-in-out`}
      >
        <ActionButtonsRow className="flex-shrink-0 flex mt-1 justify-center gap-2" />
        <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
      </Sidebar>

      <Content
        ref={contentContainerRef}
        className={`border-l ${theme === "light" ? "border-l-gray-300/40 bg-slate-100/60" : "border-l-black/40 bg-slate-900/60"}`}
      >
        <FloatingNoteTitle className="pt-2" />
        <MarkdownEditor />
      </Content>
      <ChatComponent
        className={`${theme === "light" ? "bg-slate-200/40" : "bg-slate-800/40"} transform ${showChat ? "translate-x-0 w-[250px] p-2" : "translate-x-full w-0 p-0"} transition-all duration-200 ease-in-out`}
      />
    </RootLayout>
  );
};

export default App;
