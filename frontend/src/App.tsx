import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import ElementsForm from "./components/ElementsForm";

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
    const [showNodePanel, setShowNodePanel] = useState(false);
    const [showElementPanel, setShowElementPanel] = useState(false);
    const [showSupportPanel, setShowSupportPanel] = useState(false);
    const [showLoadPanel, setShowLoadPanel] = useState(false);

    const nodeFormRef = useRef<HTMLDivElement>(null);
    const elementFormRef = useRef<HTMLDivElement>(null);
    const supportFormRef = useRef<HTMLDivElement>(null);
    const loadFormRef = useRef<HTMLDivElement>(null);
    




    useEffect(() => {
        if (showNodePanel) {
          setShowFormPanel(false);
        }
      }, [showNodePanel]);
      

    return (
        <div className="app-container">

            {/* Access Buttons */}
            <div className="access-btn-pnl">
                <div className="relative group">
                    <button
                    className="access-btn"
                    onClick={() => setShowNodePanel(prev => !prev)}
                    >
                        <svg
                        className="w-5 h-5 text-white"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeWidth="2"
                            d="M7.926 10.898 15 7.727m-7.074 5.39L15 16.29M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm12 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0-11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                        />
                        </svg>
                    </button>
                    
                    {/* Tooltip positioned within padded area */}
                    <div className="tooltip-btn">
                        Nodes inputs
                    </div>
                </div>



                <div className="relative group">
                    <button 
                    className="access-btn"
                    onClick={() => setShowElementPanel(true)}
                    >
                        <svg
                            className="w-5 h-5 text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeWidth="2"
                                d="M7.926 10.898 15 7.727m-7.074 5.39L15 16.29M8 12a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm12 5.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Zm0-11a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"
                            />
                        </svg>
                    </button>

                    <div className="tooltip-btn">
                        Elements inputs
                    </div>
                    
                </div>
                

                <div className="relative group">
                    <button 
                    className="access-btn"
                    onClick={() => setShowSupportPanel((prev) => !prev)}
                    >
                        <svg
                            className="inline w-5 h-5 mr-2 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            >
                            {/* Vertical wall */}
                            <line x1="6" y1="4" x2="6" y2="20" stroke="currentColor" strokeWidth="2" />

                            {/* Hatching lines */}
                            <line x1="6" y1="6" x2="3" y2="3" stroke="currentColor" strokeWidth="2" />
                            <line x1="6" y1="10" x2="3" y2="7" stroke="currentColor" strokeWidth="2" />
                            <line x1="6" y1="14" x2="3" y2="11" stroke="currentColor" strokeWidth="2" />
                            <line x1="6" y1="18" x2="3" y2="15" stroke="currentColor" strokeWidth="2" />

                            {/* Horizontal element */}
                            <line x1="6" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </button>
                    <div className="tooltip-btn">
                            Supports inputs
                    </div>

                </div>

                



                <div className="relative group">
                    <button 
                    className="access-btn"
                    onClick={() => setShowLoadPanel((prev) => !prev)}
                    >
                        <svg
                            className="w-6 h-6 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 64 32"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            >
                            
                            <line x1="5" y1="24" x2="59" y2="24" stroke="maroon" strokeWidth="10" />

                            <line x1="16" y1="2" x2="16" y2="22" />
                            <line x1="14" y1="20" x2="16" y2="22" />
                            <line x1="18" y1="20" x2="16" y2="22" />

                            <line x1="32" y1="2" x2="32" y2="22" />
                            <line x1="30" y1="20" x2="32" y2="22" />
                            <line x1="34" y1="20" x2="32" y2="22" />

                            <line x1="48" y1="2" x2="48" y2="22" />
                            <line x1="46" y1="20" x2="48" y2="22" />
                            <line x1="50" y1="20" x2="48" y2="22" />
                        </svg>
                    </button>
                    <div className="tooltip-btn">
                        Loads inputs
                    </div>    

                </div>

                

            </div>
        

            {showNodePanel && (
            <Draggable
                nodeRef={nodeFormRef}
                handle=".form-drag-handle" // ✅ match the working handle
            >
                <motion.div
                ref={nodeFormRef}
                className="form-section absolute left-[40px] top-[60px]"
                style={{ width: '180px' }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 10, y: 10, x: 10 }}
                exit={{ opacity: 0, y: -20 }}
                >
              

                {/* ❌ Close Button */}
                <button
                    className="text-sm text-red-600 absolute top-1 right-1"
                    onClick={() => setShowNodePanel(false)}
                >
                    ✕
                </button>

                {/* ✅ Actual Form */}
                <NodesForm  
                    onUpdate={(nodes) => {
                    setVisualizationNodes(nodes);
                    }}
                />
                </motion.div>
            </Draggable>
            )}



            {showElementPanel && (
            <Draggable nodeRef={elementFormRef} handle=".form-drag-handle">
                <motion.div
                ref={elementFormRef}
                className="form-section absolute left-[40px] top-[90px]"
                style={{ width: '250px' }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0, x: 180 }}
                exit={{ opacity: 0, y: -20 }}
                >

                <button
                    className="text-sm text-red-600 absolute top-1 right-1"
                    onClick={() => setShowElementPanel(false)}
                >
                    ✕
                </button>
                <ElementsForm
                    nodes={visualizationNodes}
                    onUpdate={(elements) => setVisualizationElements(elements)}
                />
                </motion.div>
            </Draggable>
            )}


            {showSupportPanel && (
            <Draggable nodeRef={supportFormRef} handle=".form-drag-handle">
                <motion.div
                ref={supportFormRef}
                className="form-section bg-black h-250px w-150px absolute left-[480px] top-[120px]"
                style={{ width: '250px' }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                >

                <button
                    className="text-sm text-red-600 absolute top-1 right-1"
                    onClick={() => setShowSupportPanel(false)}
                >
                    ✕
                </button>
                <SupportsForm onUpdate={setVisualizationSupports} />
                </motion.div>
            </Draggable>
            )}


            {showLoadPanel && (
            <Draggable nodeRef={loadFormRef} handle=".form-drag-handle">
                <motion.div
                ref={loadFormRef}
                className="form-section  bg-black h-250px w-150px absolute left-[750px] top-[120px]"
                style={{ width: '250px' }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                >

                <button
                    className="text-sm text-red-600 absolute top-1 right-1"
                    onClick={() => setShowLoadPanel(false)}
                >
                    ✕
                </button>
                <LoadsForm onUpdate={setVisualizationLoads} />
                </motion.div>
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
