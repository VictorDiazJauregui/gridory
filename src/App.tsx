import { DemoMenu } from "./demo/DemoMenu";
import { useDemoPinned } from "./demo/use-demo-pinned";
import { useDemoRoute } from "./demo/use-demo-route";
import { SidebarLayout } from "./sidebar";

const App = () => {
  const { selectedModuleId, selectedModule, setRoute } = useDemoRoute();
  const { pinned, setPinned } = useDemoPinned();
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SidebarLayout pinned={pinned} onPinnedChange={setPinned}>
        <DemoMenu selectedModuleId={selectedModuleId} onSelect={setRoute} />
        <main className="p-4">{selectedModule.content}</main>
      </SidebarLayout>
    </div>
  );
};

export default App;
