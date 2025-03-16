import { useState } from 'react';
import NodesForm from "./components/NodesForm";
import Scene3D from "./components/Scene3D";
import './styles/styles_App.css';

function App() {
  const [visualizationNodes, setVisualizationNodes] = useState<
    { x: number; y: number; z: number }[]
  >([]);
  const [visualizationElements, setVisualizationElements] = useState<
    { startNode: string; endNode: string }[]
  >([]);

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
      </div>
      
      {/* Visualization Section */}
      <div className="visualization-section flex-1 rounded-lg shadow-lg bg-white overflow-hidden">
        <Scene3D 
          nodes={visualizationNodes} 
          elements={visualizationElements} 
        />
      </div>
    </div>
  );
}

export default App;