import {
  Content,
  FloatingNoteTitle,
  MarkdownEditor,
  NotePreviewList,
  RootLayout,
  Sidebar,
} from "@/components";
import { ActionButtonsRow } from "@/components";
import { useRef } from "react";

const App = () => {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
  const contentContainerRef = useRef<HTMLDivElement>(null);
  const resetScroll = () => {
    contentContainerRef.current?.scrollTo(0, 0);
  };
  return (
    <RootLayout>
      <Sidebar className="bg-slate-800/15 p-2">
        <ActionButtonsRow className="flex justify-between mt-1" />
        <NotePreviewList className="mt-3 space-y-1" onSelect={resetScroll} />
      </Sidebar>
      <Content
        ref={contentContainerRef}
        className="border-l border-l-black/40 bg-slate-50/30"
        // className="border-l border-l-white/20 bg-zinc-900/50 "
      >
        <FloatingNoteTitle className="pt-2" />
        <MarkdownEditor />
      </Content>
    </RootLayout>
  );
};

export default App;
