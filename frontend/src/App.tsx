import { useState } from "react";
import NodesForm from "./components/NodesForm";
import SupportsForm from "./components/SupportsForm";  // ✅ Optional if you're using it
import LoadsForm from "./components/LoadsForm";
import Scene3D from "./components/Scene3D";
import DirectionCosinesTable from "./components/DirectionCosinesTable";
import TransformationMatrixTable from "./components/TransformationMatrixTable";
import ElementStiffnessMatrices from "./components/ElementStiffnessMatrices";
import GlobalStiffnessMatrix from "./components/GlobalStiffnessMatrix";



import "./styles/styles_App.css";

function App() {
  const [visualizationNodes, setVisualizationNodes] = useState<
    { x: number; y: number; z: number }[]
  >([]);

  const [visualizationElements, setVisualizationElements] = useState<
    { startNode: string; endNode: string }[]
  >([]);

  const [visualizationSupports, setVisualizationSupports] = useState<
  {
    id: number;
    node_coordinate: string;
    x_restrained: boolean;
    y_restrained: boolean;
    z_restrained: boolean;
    }[]
  >([]);

  const [visualizationLoads, setVisualizationLoads] = useState<
  {
    node_coordinate: string;
    Fx: number;
    Fy: number;
    Fz: number;
    }[]
  >([]);





  console.log("Nodes for visualization:", visualizationNodes);
  console.log("Elements for visualization:", visualizationElements);

  return (
    <div className="app-container min-h-screen flex flex-col lg:flex-row gap-4 p-4 bg-gray-100">
      {/* Left Side - Forms */}
      <div className="form-section w-full lg:w-96 bg-white rounded-lg shadow-lg p-4 overflow-y-auto">
        <NodesForm
          onUpdate={(nodes, elements) => {
            setVisualizationNodes(nodes);
            setVisualizationElements(elements);
          }}
        />
        <SupportsForm onUpdate={setVisualizationSupports} />

        <LoadsForm onUpdate={setVisualizationLoads} />

        {/* <SupportsForm /> ← Uncomment when needed */}
      </div>

      {/* Right Side - 3D Visualization */}
      <div className="flex-1 bg-white rounded-lg shadow-lg p-4">
        <Scene3D 
          nodes={visualizationNodes}
          elements={visualizationElements}
          supports={visualizationSupports}
          loads={visualizationLoads}  // ✅ Add this line
        />
        <DirectionCosinesTable />
        <TransformationMatrixTable />
        <ElementStiffnessMatrices />
        <GlobalStiffnessMatrix />
        
      </div>
          
          
    </div>
  );
}

export default App;
