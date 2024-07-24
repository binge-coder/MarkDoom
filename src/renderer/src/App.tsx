import {
  Content,
  FloatingNoteTitle,
  MarkdownEditor,
  NotePreviewList,
  RootLayout,
  Sidebar,
  ChatComponent,
  ActionButton,
} from "@/components";
import { ActionButtonsRow } from "@/components";
import { useRef, useState } from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";

const App = () => {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0);
  };
  const [showChat, setShowChat] = useState(false);
  const toggleChatView = () => {
    setShowChat((obj) => !obj);
  };
  return (
    <RootLayout>
      <Sidebar className="bg-slate-800/15 p-2">
        <ActionButtonsRow className="flex justify-between mt-1" />
        <ActionButton onClick={toggleChatView} className="mt-2">
          <IoChatboxEllipsesOutline className="h-4 w-4" />
          {/* <p className="border border-red-500">open chat window</p> */}
        </ActionButton>
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
