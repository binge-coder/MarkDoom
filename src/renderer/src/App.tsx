import {
  Content,
  FloatingNoteTitle,
  MarkdownEditor,
  NotePreviewList,
  RootLayout,
  Sidebar,
  ChatComponent,
  ActionButton,
  PreferencesPage,
} from "@/components";
import { ActionButtonsRow } from "@/components";
import { useRef, useState } from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import SettingsButton from "./components/Button/SettingsButton";

const App = () => {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0);
  };
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const toggleChatView = () => {
    setShowChat((obj) => !obj);
  };
  const handleOpenSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };
  return (
    <RootLayout>
      <PreferencesPage isVisible={showSettings} onClose={handleCloseSettings} />
      <Sidebar className="bg-slate-800/15 p-2">
        <ActionButtonsRow className="flex justify-between mt-1" />
        <ActionButton onClick={toggleChatView} className="mt-2">
          <IoChatboxEllipsesOutline className="h-4 w-4" />
          {/* <p className="border border-red-500">open chat window</p> */}
        </ActionButton>
        {/* <ActionButton>
          <button onClick={handleOpenSettings}>settings</button>
        </ActionButton> */}
        <SettingsButton onClick={handleOpenSettings} />
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
