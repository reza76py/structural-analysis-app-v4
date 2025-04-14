// import React, { useRef, useState } from "react";
// import axios from "axios";
// import Draggable from "react-draggable";
// import NodesForm from "./components/NodesForm";
// import SupportsForm from "./components/SupportsForm";
// import LoadsForm from "./components/LoadsForm";
// import Scene3D from "./components/Scene3D";
// import DirectionCosinesTable from "./components/DirectionCosinesTable";
// import TransformationMatrixTable from "./components/TransformationMatrixTable";
// import ElementStiffnessMatrices from "./components/ElementStiffnessMatrices";
// import GlobalStiffnessMatrix from "./components/GlobalStiffnessMatrix";
// import DofIndicesTable from "./components/DofIndicesTable";
// import ElementDOFMapping from "./components/ElementDOFMapping";
// import AssembledMatrix from "./components/AssembledMatrix";
// import BoundaryConditionsResult from "./components/BoundaryConditionsResult";
// import SolveDisplacement from "./components/SolveDisplacement";
// import ReactionForces from "./components/ReactionForces";
// import InternalAxialForces from "./components/InternalAxialForces";
// import FileUploadForm from "./components/load/FileUploadForm";
// import FileUploadFormExl from "./components/load/FileUploadFormExl";
// import "./styles/styles_App.css";

// function App() {
//     const [showDirectionCosines, setShowDirectionCosines] = useState(false);
//     const [showTransformationMatrix, setShowTransformationMatrix] =useState(false);
//     const [showElementStiffness, setShowElementStiffness] = useState(false);
//     const [showGlobalStiffness, setShowGlobalStiffness] = useState(false);
//     const [showDOFIndices, setShowDOFIndices] = useState(false);
//     const [showDOFMapping, setShowDOFMapping] = useState(false);
//     const [showAssembledMatrix, setShowAssembledMatrix] = useState(false);
//     const [showBoundaryConditions, setShowBoundaryConditions] = useState(false);
//     const [showDisplacements, setShowDisplacements] = useState(false);
//     const [showReactions, setShowReactions] = useState(false);
//     const [showAxialForces, setShowAxialForces] = useState(false);
//     const [visualizationNodes, setVisualizationNodes] = useState<{ x: number; y: number; z: number }[]>([]);
//     const [visualizationElements, setVisualizationElements] = useState<{ startNode: string; endNode: string }[]>([]);
//     const [visualizationSupports, setVisualizationSupports] = useState<
//         {
//             id: number;
//             node_coordinate: string;
//             x_restrained: boolean;
//             y_restrained: boolean;
//             z_restrained: boolean;
//         }[]
//     >([]);
//     const [visualizationLoads, setVisualizationLoads] = useState<
//         {
//             node_coordinate: string;
//             Fx: number;
//             Fy: number;
//             Fz: number;
//         }[]
//     >([]);
//     const [showFormPanel, setShowFormPanel] = useState(false);
//     const formRef = useRef<HTMLDivElement>(null);








//     return (
//         <div className="app-container">
//             <div className="fixed top-4 left-4 z-50">
//                 <button
//                     className="bg-blue-600 text-white px-4 py-2 rounded shadow"
//                     onClick={() => setShowFormPanel(!showFormPanel)}
//                 >
//                     {showFormPanel
//                         ? "❌ Close Input Panel"
//                         : "📋 Open Input Panel"}
//                 </button>
//             </div>



//             {showFormPanel && (
//                 <Draggable nodeRef={formRef as React.RefObject<HTMLElement>} handle=".form-drag-handle">
//                     <div
//                         ref={formRef}
//                         className="form-section fixed top-20 left-10 z-40 bg-white rounded-lg shadow-lg p-4 w-96 max-h-[90vh] overflow-y-auto"
//                     >
//                         <div className="form-drag-handle bg-blue-300 text-white p-2 rounded-t cursor-move mb-2">
//                             🧩 Input Forms (Drag Me)
//                         </div>
//                         <FileUploadForm />
//                         <FileUploadFormExl />
//                         <NodesForm
//                             onUpdate={(nodes, elements) => {
//                                 setVisualizationNodes(nodes);
//                                 setVisualizationElements(elements);
//                             }}
//                         />
//                         <SupportsForm onUpdate={setVisualizationSupports} />
//                         <LoadsForm onUpdate={setVisualizationLoads} />
//                         <button
//                             className="bg-red-600 text-white rounded"
//                             onClick={async () => {
//                                 if (
//                                     window.confirm(
//                                         "⚠️ Are you sure you want to delete ALL data?",
//                                     )
//                                 ) {
//                                     try {
//                                         await axios.delete(
//                                             "http://127.0.0.1:8000/api/nodes/",
//                                         );
//                                         setVisualizationNodes([]);
//                                         setVisualizationElements([]);
//                                         setVisualizationSupports([]);
//                                         setVisualizationLoads([]);
//                                         alert("✅ Workspace reset!");
//                                     } catch (error) {
//                                         console.error(
//                                             "❌ Error resetting workspace:",
//                                             error,
//                                         );
//                                         alert("❌ Failed to reset workspace.");
//                                     }
//                                 }
//                             }}
//                         >
//                             🗑 Reset Workspace
//                         </button>
//                     </div>
//                 </Draggable>
//             )}

//             <div className="flex-1">
//                 <Scene3D
//                     nodes={visualizationNodes}
//                     elements={visualizationElements}
//                     supports={visualizationSupports}
//                     loads={visualizationLoads}
//                 />

//                 <div className="btn-tables-wrap">
//                     <button
//                         className="btn-tables"
//                         onClick={() => setShowDirectionCosines((prev) => !prev)}
//                     >
//                         Direction Cosines
//                     </button>
//                     <button
//                         className="btn-tables"
//                         onClick={() =>
//                             setShowTransformationMatrix((prev) => !prev)
//                         }
//                     >
//                         Transformation Matrix
//                     </button>
//                     <button
//                         className="btn-tables"
//                         onClick={() => setShowElementStiffness((prev) => !prev)}
//                     >
//                         Element Stiffness
//                     </button>
//                     <button
//                         className="btn-tables"
//                         onClick={() => setShowGlobalStiffness((prev) => !prev)}
//                     >
//                         Global Stiffness
//                     </button>
//                     <button
//                         className="btn-tables"
//                         onClick={() => setShowDOFIndices((prev) => !prev)}
//                     >
//                         DOF Indices
//                     </button>
//                     <button
//                         className="btn-tables"
//                         onClick={() => setShowDOFMapping((prev) => !prev)}
//                     >
//                         DOF Mapping
//                     </button>
//                     <button
//                         className="btn-tables"
//                         onClick={() => setShowAssembledMatrix((prev) => !prev)}
//                     >
//                         Assembled Matrix
//                     </button>
//                     <button
//                         className="btn-tables"
//                         onClick={() =>
//                             setShowBoundaryConditions((prev) => !prev)
//                         }
//                     >
//                         Boundary Conditions
//                     </button>
//                     <button
//                         className="btn-tables"
//                         onClick={() => setShowDisplacements((prev) => !prev)}
//                     >
//                         Displacements
//                     </button>
//                     <button
//                         className="btn-tables"
//                         onClick={() => setShowReactions((prev) => !prev)}
//                     >
//                         Reactions
//                     </button>
//                     <button
//                         className="btn-tables"
//                         onClick={() => setShowAxialForces((prev) => !prev)}
//                     >
//                         Axial Forces
//                     </button>
//                 </div>

//                 {showDirectionCosines && (
//                     <div className="directionCosinesTable">
//                         <DirectionCosinesTable />
//                     </div>
//                 )}

//                 {showTransformationMatrix && (
//                     <div className="transformationMatrixTable">
//                         <TransformationMatrixTable />
//                     </div>
//                 )}

//                 {showElementStiffness && (
//                     <div className="elementStiffnessMatrices">
//                         <ElementStiffnessMatrices />
//                     </div>
//                 )}

//                 {showGlobalStiffness && (
//                     <div className="globalStiffnessMatrix">
//                         <GlobalStiffnessMatrix />
//                     </div>
//                 )}

//                 {showDOFIndices && (
//                     <div className="dofIndicesTable">
//                         <DofIndicesTable />
//                     </div>
//                 )}

//                 {showDOFMapping && (
//                     <div className="elementDOFMapping">
//                         <ElementDOFMapping />
//                     </div>
//                 )}

//                 {showAssembledMatrix && (
//                     <div className="assembledMatrix">
//                         <AssembledMatrix />
//                     </div>
//                 )}

//                 {showBoundaryConditions && (
//                     <div className="boundaryConditionsResult">
//                         <BoundaryConditionsResult />
//                     </div>
//                 )}

//                 {showDisplacements && (
//                     <div className="solveDisplacement">
//                         <SolveDisplacement />
//                     </div>
//                 )}

//                 {showReactions && (
//                     <div className="reactionForces">
//                         <ReactionForces />
//                     </div>
//                 )}

//                 {showAxialForces && (
//                     <div className="internalAxialForces">
//                         <InternalAxialForces />
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default App;














import React, { useRef, useState } from "react";
import axios from "axios";
import Draggable from "react-draggable";
import NodesForm from "./components/NodesForm";
import SupportsForm from "./components/SupportsForm";
import LoadsForm from "./components/LoadsForm";
import Scene3D from "./components/Scene3D";
import DirectionCosinesTable from "./components/DirectionCosinesTable";
import TransformationMatrixTable from "./components/TransformationMatrixTable";
import ElementStiffnessMatrices from "./components/ElementStiffnessMatrices";
import GlobalStiffnessMatrix from "./components/GlobalStiffnessMatrix";
import DofIndicesTable from "./components/DofIndicesTable";
import ElementDOFMapping from "./components/ElementDOFMapping";
import AssembledMatrix from "./components/AssembledMatrix";
import BoundaryConditionsResult from "./components/BoundaryConditionsResult";
import SolveDisplacement from "./components/SolveDisplacement";
import ReactionForces from "./components/ReactionForces";
import InternalAxialForces from "./components/InternalAxialForces";
import FileUploadForm from "./components/load/FileUploadForm";
import FileUploadFormExl from "./components/load/FileUploadFormExl";
import "./styles/styles_App.css";

function App() {
    const [showDirectionCosines, setShowDirectionCosines] = useState(false);
    const [showTransformationMatrix, setShowTransformationMatrix] = useState(false);
    const [showElementStiffness, setShowElementStiffness] = useState(false);
    const [showGlobalStiffness, setShowGlobalStiffness] = useState(false);
    const [showDOFIndices, setShowDOFIndices] = useState(false);
    const [showDOFMapping, setShowDOFMapping] = useState(false);
    const [showAssembledMatrix, setShowAssembledMatrix] = useState(false);
    const [showBoundaryConditions, setShowBoundaryConditions] = useState(false);
    const [showDisplacements, setShowDisplacements] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [showAxialForces, setShowAxialForces] = useState(false);
    const [visualizationNodes, setVisualizationNodes] = useState<{ x: number; y: number; z: number }[]>([]);
    const [visualizationElements, setVisualizationElements] = useState<{ startNode: string; endNode: string }[]>([]);
    const [visualizationSupports, setVisualizationSupports] = useState<{
        id: number;
        node_coordinate: string;
        x_restrained: boolean;
        y_restrained: boolean;
        z_restrained: boolean;
    }[]>([]);
    const [visualizationLoads, setVisualizationLoads] = useState<{
        node_coordinate: string;
        Fx: number;
        Fy: number;
        Fz: number;
    }[]>([]);
    const [showFormPanel, setShowFormPanel] = useState(false);
    const [elementsAdded, setElementsAdded] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    return (
        <div className="app-container">
            <div className="fixed top-4 left-4 z-50">
                <button
                    className="bg-blue-300 text-white text-[10px] px-4 py-2 rounded shadow"
                    onClick={() => setShowFormPanel(!showFormPanel)}
                >
                    {showFormPanel ? "❌ Close Input Panel" : "📋 Open Input Panel"}
                </button>
            </div>

            {showFormPanel && (
                <Draggable nodeRef={formRef as React.RefObject<HTMLElement>} handle=".form-drag-handle">
                    <div
                        ref={formRef}
                        className="form-section fixed top-20 left-10 z-40 rounded-xl shadow-xl p-4 w-52 max-h-[90vh] overflow-y-auto">
                        <div className="form-drag-handle bg-blue-400/80 rounded-md text-xs p-2 cursor-move mb-2 backdrop-blur-sm">
                            
                        </div>
                        <FileUploadForm />
                        <FileUploadFormExl />
                        {/* Always show NodesForm first */}
                        <NodesForm
                            onUpdate={(nodes, elements) => {
                                setVisualizationNodes(nodes);
                                setVisualizationElements(elements);

                                // If any elements were added, reveal the rest of the forms
                                if (elements.length > 0) {
                                    setElementsAdded(true);
                                }
                            }}
                        />

                        {/* Only show other forms after elements are added */}
                        {elementsAdded && (
                            <>
                                
                                <SupportsForm onUpdate={setVisualizationSupports} />
                                <LoadsForm onUpdate={setVisualizationLoads} />
                                <button
                                    className="bg-red-600 text-white rounded text-[10px] px-4 py-2 mt-2 w-full h-6 flex items-center justify-center"
                                    onClick={async () => {
                                        if (window.confirm("⚠️ Are you sure you want to delete ALL data?")) {
                                            try {
                                                await axios.delete("http://127.0.0.1:8000/api/nodes/");
                                                setVisualizationNodes([]);
                                                setVisualizationElements([]);
                                                setVisualizationSupports([]);
                                                setVisualizationLoads([]);
                                                setElementsAdded(false);
                                                alert("✅ Workspace reset!");
                                            } catch (error) {
                                                console.error("❌ Error resetting workspace:", error);
                                                alert("❌ Failed to reset workspace.");
                                            }
                                        }
                                    }}
                                >
                                    🗑 Reset Workspace
                                </button>
                            </>
                        )}
                    </div>
                </Draggable>
            )}

            <div className="flex-1">
                <Scene3D
                    nodes={visualizationNodes}
                    elements={visualizationElements}
                    supports={visualizationSupports}
                    loads={visualizationLoads}
                />

                <div className="btn-tables-wrap">
                    <button className="btn-tables hover:drop-shadow-glow" onClick={() => setShowDirectionCosines((prev) => !prev)}>Direction Cosines</button>
                    <button className="btn-tables hover:drop-shadow-glow" onClick={() => setShowTransformationMatrix((prev) => !prev)}>Transformation Matrix</button>
                    <button className="btn-tables hover:drop-shadow-glow" onClick={() => setShowElementStiffness((prev) => !prev)}>Element Stiffness</button>
                    <button className="btn-tables hover:drop-shadow-glow" onClick={() => setShowGlobalStiffness((prev) => !prev)}>Global Stiffness</button>
                    <button className="btn-tables hover:drop-shadow-glow" onClick={() => setShowDOFIndices((prev) => !prev)}>DOF Indices</button>
                    <button className="btn-tables hover:drop-shadow-glow" onClick={() => setShowDOFMapping((prev) => !prev)}>DOF Mapping</button>
                    <button className="btn-tables hover:drop-shadow-glow" onClick={() => setShowAssembledMatrix((prev) => !prev)}>Assembled Matrix</button>
                    <button className="btn-tables hover:drop-shadow-glow" onClick={() => setShowBoundaryConditions((prev) => !prev)}>Boundary Conditions</button>
                    <button className="btn-tables hover:drop-shadow-glow" onClick={() => setShowDisplacements((prev) => !prev)}>Displacements</button>
                    <button className="btn-tables hover:drop-shadow-glow" onClick={() => setShowReactions((prev) => !prev)}>Reactions</button>
                    <button className="btn-tables hover:drop-shadow-glow" onClick={() => setShowAxialForces((prev) => !prev)}>Axial Forces</button>
                </div>

                {showDirectionCosines && <div className="directionCosinesTable"><DirectionCosinesTable /></div>}
                {showTransformationMatrix && <div className="transformationMatrixTable"><TransformationMatrixTable /></div>}
                {showElementStiffness && <div className="elementStiffnessMatrices"><ElementStiffnessMatrices /></div>}
                {showGlobalStiffness && <div className="globalStiffnessMatrix"><GlobalStiffnessMatrix /></div>}
                {showDOFIndices && <div className="dofIndicesTable"><DofIndicesTable /></div>}
                {showDOFMapping && <div className="elementDOFMapping"><ElementDOFMapping /></div>}
                {showAssembledMatrix && <div className="assembledMatrix"><AssembledMatrix /></div>}
                {showBoundaryConditions && <div className="boundaryConditionsResult"><BoundaryConditionsResult /></div>}
                {showDisplacements && <div className="solveDisplacement"><SolveDisplacement /></div>}
                {showReactions && <div className="reactionForces"><ReactionForces /></div>}
                {showAxialForces && <div className="internalAxialForces"><InternalAxialForces /></div>}
            </div>
        </div>
    );
}

export default App;
