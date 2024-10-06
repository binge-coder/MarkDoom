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
import { showChatAtom, showLeftSideBarAtom, showSettingsAtom } from "@/store";
import { useAtom, useAtomValue } from "jotai";
import { useRef } from "react";

const App = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0);
  };

  const [showChat] = useAtom(showChatAtom);
  const [showSettings, setShowSettings] = useAtom(showSettingsAtom);
  const showLeftSideBar = useAtomValue(showLeftSideBarAtom);

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <RootLayout>
      <PreferencesPage isVisible={showSettings} onClose={handleCloseSettings} />

      <Sidebar
        className={`bg-slate-800/40 transform ${showLeftSideBar ? "translate-x-0 w-[250px] p-2" : "-translate-x-full w-0 p-0"} transition-all duration-200 ease-in-out`}
      >
        <ActionButtonsRow className="flex mt-1 justify-center gap-2" />
        <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
      </Sidebar>

      <Content
        ref={contentContainerRef}
        className="border-l border-l-black/40 bg-slate-900/60"
      >
        <FloatingNoteTitle className="pt-2" />
        <MarkdownEditor />
      </Content>
      <ChatComponent
        className={`bg-slate-800/40 transform ${showChat ? "translate-x-0 w-[250px] p-2" : "translate-x-full w-0 p-0"} transition-all duration-200 ease-in-out`}
      />
    </RootLayout>
  );
};

export default App;
