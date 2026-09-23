import { DemoSidebar } from "./demo/DemoSidebar";
import { useDemoRoute } from "./demo/use-demo-route";

const App = () => {
  const { selectedModuleId, selectedModule, setRoute } = useDemoRoute();
  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <DemoSidebar selectedModuleId={selectedModuleId} onSelect={setRoute} />
      <main className="flex-1 p-4 w-full h-full">{selectedModule.content}</main>
    </div>
  );
};

export default App;
