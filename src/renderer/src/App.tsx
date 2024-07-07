import {
  Content,
  MarkdownEditor,
  NotePreviewList,
  RootLayout,
  Sidebar,
} from "@/components";
import { ActionButtonsRow } from "@/components";

const App = () => {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <RootLayout>
      <Sidebar className="bg-zinc-600/30 p-2">
        <ActionButtonsRow className="flex justify-between mt-1" />
        <NotePreviewList className="mt-3 space-y-1" />
      </Sidebar>
      <Content className="border-l border-l-white/20 bg-zinc-900/50 ">
        <MarkdownEditor />
      </Content>
    </RootLayout>
  );
};

export default App;
