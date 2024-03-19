import { Content, RootLayout, Sidebar } from "./components"

function App(): JSX.Element {
  // const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')

  return (
<RootLayout>
  <Sidebar className="bg-zinc-500/30 p-2">sidebar</Sidebar>
  <Content className="border-l border-l-white/20 bg-zinc-500/40 "> content </Content>
</RootLayout>
  )
}

export default App
