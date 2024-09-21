import {
  Content,
  FloatingNoteTitle,
  MarkdownEditor,
  NotePreviewList,
  RootLayout,
  Sidebar,
  ChatComponent,
  PreferencesPage,
  LeftBarHideButton,
} from "@/components";
import { ActionButtonsRow } from "@/components";
import { useRef } from "react";
import { useAtom, useAtomValue } from "jotai";
import { showChatAtom, showLeftSideBarAtom, showSettingsAtom } from "@/store";

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
      {showLeftSideBar && (
        <Sidebar className="bg-slate-800/40 p-2">
          <ActionButtonsRow className="flex mt-1 justify-center gap-2" />
          <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
        </Sidebar>
      )}
      <Content
        ref={contentContainerRef}
        className="border-l border-l-black/40 bg-slate-900/60"
      >
        <FloatingNoteTitle className="pt-2" />
        <MarkdownEditor />
      </Content>
      {showChat && <ChatComponent className="bg-slate-800/40" />}
    </RootLayout>
  );
};

export default App;
