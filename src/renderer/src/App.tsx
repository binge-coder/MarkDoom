import {
  Content,
  FloatingNoteTitle,
  MarkdownEditor,
  NotePreviewList,
  RootLayout,
  Sidebar,
  ChatComponent,
  PreferencesPage,
} from "@/components";
import { ActionButtonsRow } from "@/components";
import { useRef } from "react";
import { useAtom } from "jotai";
import { showChatAtom, showSettingsAtom } from "@/store";

const App = () => {
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0);
  };

  const [showChat] = useAtom(showChatAtom);
  const [showSettings, setShowSettings] = useAtom(showSettingsAtom);

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  return (
    <RootLayout>
      <PreferencesPage isVisible={showSettings} onClose={handleCloseSettings} />
      <Sidebar className="bg-slate-800/15 p-2">
        <ActionButtonsRow className="flex mt-1 justify-center gap-2" />
        <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
      </Sidebar>
      <Content
        ref={contentContainerRef}
        className="border-l border-l-black/40 bg-slate-50/30"
      >
        <FloatingNoteTitle className="pt-2" />
        <MarkdownEditor />
      </Content>
      {showChat && <ChatComponent />}
    </RootLayout>
  );
};

export default App;
