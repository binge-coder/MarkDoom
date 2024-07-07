import { Content, RootLayout, Sidebar } from "@/components";
import { ActionButtonsRow } from "@/components";

const App = () => {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
    <RootLayout>
      <Sidebar className="bg-zinc-600/30 p-2">
        <ActionButtonsRow className="flex justify-between mt-1" />
      </Sidebar>
      <Content className="border-l border-l-white/20 bg-zinc-900/50 ">
        content
      </Content>
    </RootLayout>
  );
};

export default App;
