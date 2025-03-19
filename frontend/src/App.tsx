import { useState } from "react";
import NodesForm from "./components/NodesForm";
import Scene3D from "./components/Scene3D";
import SupportsForm from "./components/SupportsForm";  // ✅ Import SupportsForm
import LoadsForm from "./components/LoadsForm";
import "./styles/styles_App.css";

function App() {
  const [visualizationNodes, setVisualizationNodes] = useState<
    { x: number; y: number; z: number }[]
  >([]);
  console.log("Nodes for visualization:", visualizationNodes);
  const [visualizationElements, setVisualizationElements] = useState<
    { startNode: string; endNode: string }[]
  >([]);
  console.log("Elements for visualization:", visualizationElements);

  return (
    <div className="app-container min-h-screen flex flex-col lg:flex-row gap-4 p-4 bg-gray-100">
      {/* Form Section */}
      <div className="form-section w-full lg:w-96 bg-white rounded-lg shadow-lg p-4 overflow-y-auto">
        <NodesForm 
          onUpdate={(nodes, elements) => {
            setVisualizationNodes(nodes);
            setVisualizationElements(elements);
          }}
        />
        <SupportsForm />  {/* ✅ Add SupportsForm here */}
      </div>
      
      {/* Visualization Section */}
      <div className="visualization-section flex-1 p-4 bg-white rounded-lg shadow-lg border border-gray-300">
        <Scene3D nodes={visualizationNodes} elements={visualizationElements} />
      </div>


      <div>
          <LoadsForm />
      </div>
    </div>
  );
}

export default App;
