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
import UnifiedFileUpload from "./components/load/UnifiedFileUpload";
import AppResult from "./components/AppResult";

import "./styles/styles_App.css";
import ElementsForm from "./components/ElementsForm";
import "./api/axiosInterceptor";


function App() {
    const [showDirectionCosines, setShowDirectionCosines] = useState(false);
    const [showTransformationMatrix, setShowTransformationMatrix] =
        useState(false);
    const [showElementStiffness, setShowElementStiffness] = useState(false);
    const [showGlobalStiffness, setShowGlobalStiffness] = useState(false);
    const [showDOFIndices, setShowDOFIndices] = useState(false);
    const [showDOFMapping, setShowDOFMapping] = useState(false);
    const [showAssembledMatrix, setShowAssembledMatrix] = useState(false);
    const [showBoundaryConditions, setShowBoundaryConditions] = useState(false);
    const [showDisplacements, setShowDisplacements] = useState(false);
    const [showReactions, setShowReactions] = useState(false);
    const [showAxialForces, setShowAxialForces] = useState(false);
    const [visualizationNodes, setVisualizationNodes] = useState<
        { id: number; x: number; y: number; z: number }[]
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
    // removed unused `elementsAdded` state and setter
    const [showNodePanel, setShowNodePanel] = useState(false);
    const [showElementPanel, setShowElementPanel] = useState(false);
    const [showSupportPanel, setShowSupportPanel] = useState(false);
    const [showLoadPanel, setShowLoadPanel] = useState(false);

    const nodeFormRef = useRef<HTMLDivElement | null>(null);
    const elementFormRef = useRef<HTMLDivElement | null>(null);
    const supportFormRef = useRef<HTMLDivElement | null>(null);
    const loadFormRef = useRef<HTMLDivElement | null>(null);

    const [showUploadPanel, setShowUploadPanel] = useState(false);
    const uploadRef = useRef<HTMLDivElement | null>(null);

    const refreshNodes = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/nodes/");
            setVisualizationNodes(res.data);
        } catch (err) {
            console.error("❌ Failed to refresh nodes:", err);
        }
    };

    useEffect(() => {
    // Removed unused effect that updated showFormPanel (state removed).
    // Run initial refresh on mount
    refreshNodes();
    }, []);

    return (
        <div className="app-container">
            {/* Access Buttons */}
            <div className="access-btn-pnl">
                <div className="relative group">
                    <button
                        className="access-btn"
                        onClick={() => setShowUploadPanel((prev) => !prev)}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="orange"
                            className="w-4 h-4"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 6.75V6a2.25 2.25 0 012.25-2.25h4.879a2.25 2.25 0 011.591.659l1.621 1.621a2.25 2.25 0 001.591.659H18.75A2.25 2.25 0 0121 9.375v8.25A2.25 2.25 0 0118.75 19.5H5.25A2.25 2.25 0 013 17.625V6.75z"
                            />
                        </svg>
                    </button>
                    <div className="tooltip-btn">Upload File</div>
                </div>

                <div className="relative group mb-6">
                    <button
                        className="access-btn"
                        onClick={() => setShowNodePanel((prev) => !prev)}
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
                    <div className="tooltip-btn">Nodes inputs</div>
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

                    <div className="tooltip-btn">Elements inputs</div>
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
                            <line
                                x1="6"
                                y1="4"
                                x2="6"
                                y2="20"
                                stroke="currentColor"
                                strokeWidth="2"
                            />

                            {/* Hatching lines */}
                            <line
                                x1="6"
                                y1="6"
                                x2="3"
                                y2="3"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <line
                                x1="6"
                                y1="10"
                                x2="3"
                                y2="7"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <line
                                x1="6"
                                y1="14"
                                x2="3"
                                y2="11"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                            <line
                                x1="6"
                                y1="18"
                                x2="3"
                                y2="15"
                                stroke="currentColor"
                                strokeWidth="2"
                            />

                            {/* Horizontal element */}
                            <line
                                x1="6"
                                y1="12"
                                x2="20"
                                y2="12"
                                stroke="currentColor"
                                strokeWidth="2"
                            />
                        </svg>
                    </button>
                    <div className="tooltip-btn">Supports inputs</div>
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
                            <line
                                x1="5"
                                y1="24"
                                x2="59"
                                y2="24"
                                stroke="maroon"
                                strokeWidth="10"
                            />

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
                    <div className="tooltip-btn">Loads inputs</div>
                </div>

                <div className="access-btn-pnl">
                    ...
                    <AppResult />
                </div>
            </div>

            {showUploadPanel && (
                <Draggable nodeRef={uploadRef as unknown as React.RefObject<HTMLElement>} handle=".form-drag-handle">
                    <div ref={uploadRef}>
                        <motion.div
                            className="form-section absolute left-[40px] top-[30px]"
                            style={{ width: "250px" }}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* ✅ Drag Handle */}
                            <div className="form-drag-handle">
                                📁 Upload File
                            </div>

                            {/* ❌ Close Button */}
                            <button
                                className="text-sm text-red-600 absolute top-1 right-1"
                                onClick={() => setShowUploadPanel(false)}
                            >
                                ✕
                            </button>

                            {/* 📤 Upload Component */}
                            {/* @ts-expect-error Component types differ from usage but runtime props are valid */}
                            <UnifiedFileUpload onUploadSuccess={refreshNodes} />
                        </motion.div>
                    </div>
                </Draggable>
            )}

            {showNodePanel && (
                <Draggable nodeRef={nodeFormRef as unknown as React.RefObject<HTMLElement>} handle=".form-drag-handle">
                    
                    <motion.div
                        ref={nodeFormRef}
                        className="form-section absolute left-[40px] top-[60px]"
                        style={{ width: "180px" }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* ✅ Drag Handle */}
                        <div className="form-drag-handle">
                            🧱 Node Input
                        </div>

                        {/* ❌ Close Button */}
                        <button
                            className="text-sm text-red-600 absolute top-1 right-1"
                            onClick={() => setShowNodePanel(false)}
                        >
                            ✕
                        </button>

                        {/* ✅ Actual Form */}
                        <NodesForm
                            onUpdate={(nodes: { id?: number; x: number; y: number; z: number }[]) => {
                                // Ensure each node has an `id`; preserve existing id if present, otherwise assign a sequential one
                                const nodesWithId = nodes.map((n, idx) => ({
                                    id: typeof n.id === "number" ? n.id : idx + 1,
                                    x: n.x,
                                    y: n.y,
                                    z: n.z,
                                }));
                                setVisualizationNodes(nodesWithId);
                            }}
                        />
                    </motion.div>
                    
                </Draggable>
            )}

            {showElementPanel && (
                <Draggable nodeRef={elementFormRef as unknown as React.RefObject<HTMLElement>} handle=".form-drag-handle">
                    
                    <motion.div
                        ref={elementFormRef}
                        className="form-section absolute left-[40px] top-[90px]"
                        style={{ width: "250px" }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0, x: 180 }}
                        exit={{ opacity: 0, y: -20 }}
                    >
                        {/* ✅ Drag Handle */}
                        <div className="form-drag-handle">
                            🧩 Element Input
                        </div>

                        {/* ❌ Close Button */}
                        <button
                            className="text-sm text-red-600 absolute top-1 right-1"
                            onClick={() => setShowElementPanel(false)}
                        >
                            ✕
                        </button>

                        {/* 🧱 Actual Form */}
                        <ElementsForm
                            nodes={visualizationNodes}
                            onUpdate={(elements) =>
                                setVisualizationElements(elements)
                            }
                        />
                    </motion.div>
                   
                </Draggable>
            )}

            {/* Support Panel */}

            {showSupportPanel && (
                <Draggable nodeRef={supportFormRef as unknown as React.RefObject<HTMLElement>} handle=".form-drag-handle">
                   
                        <motion.div
                            ref={supportFormRef}
                            className="form-section absolute left-[480px] top-[120px]"
                            style={{ width: "250px" }}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* ✅ Drag Handle */}
                            <div className="form-drag-handle">
                                🧷 Support Input
                            </div>

                            {/* ❌ Close Button */}
                            <button
                                className="text-sm text-red-600 absolute top-1 right-1"
                                onClick={() => setShowSupportPanel(false)}
                            >
                                ✕
                            </button>

                            {/* 🧱 Support Form */}
                            <SupportsForm onUpdate={setVisualizationSupports} />
                        </motion.div>
                    
                </Draggable>
            )}

            {showLoadPanel && (
                <Draggable nodeRef={loadFormRef as unknown as React.RefObject<HTMLElement>} handle=".form-drag-handle">
                    
                        <motion.div
                            ref={loadFormRef}
                            className="form-section absolute left-[750px] top-[120px]"
                            style={{ width: "250px" }}
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* ✅ Drag Handle */}
                            <div className="form-drag-handle">
                                🎯 Load Input
                            </div>

                            {/* ❌ Close Button */}
                            <button
                                className="text-sm text-red-600 absolute top-1 right-1"
                                onClick={() => setShowLoadPanel(false)}
                            >
                                ✕
                            </button>

                            {/* 💼 Loads Form */}
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
                    <button
                        className="btn-tables hover:drop-shadow-glow"
                        onClick={() => setShowDirectionCosines((prev) => !prev)}
                    >
                        Direction Cosines
                    </button>
                    <button
                        className="btn-tables hover:drop-shadow-glow"
                        onClick={() =>
                            setShowTransformationMatrix((prev) => !prev)
                        }
                    >
                        Transformation Matrix
                    </button>
                    <button
                        className="btn-tables hover:drop-shadow-glow"
                        onClick={() => setShowElementStiffness((prev) => !prev)}
                    >
                        Element Stiffness
                    </button>
                    <button
                        className="btn-tables hover:drop-shadow-glow"
                        onClick={() => setShowGlobalStiffness((prev) => !prev)}
                    >
                        Global Stiffness
                    </button>
                    <button
                        className="btn-tables hover:drop-shadow-glow"
                        onClick={() => setShowDOFIndices((prev) => !prev)}
                    >
                        DOF Indices
                    </button>
                    <button
                        className="btn-tables hover:drop-shadow-glow"
                        onClick={() => setShowDOFMapping((prev) => !prev)}
                    >
                        DOF Mapping
                    </button>
                    <button
                        className="btn-tables hover:drop-shadow-glow"
                        onClick={() => setShowAssembledMatrix((prev) => !prev)}
                    >
                        Assembled Matrix
                    </button>
                    <button
                        className="btn-tables hover:drop-shadow-glow"
                        onClick={() =>
                            setShowBoundaryConditions((prev) => !prev)
                        }
                    >
                        Boundary Conditions
                    </button>
                    <button
                        className="btn-tables hover:drop-shadow-glow"
                        onClick={() => setShowDisplacements((prev) => !prev)}
                    >
                        Displacements
                    </button>
                    <button
                        className="btn-tables hover:drop-shadow-glow"
                        onClick={() => setShowReactions((prev) => !prev)}
                    >
                        Reactions
                    </button>
                    <button
                        className="btn-tables hover:drop-shadow-glow"
                        onClick={() => setShowAxialForces((prev) => !prev)}
                    >
                        Axial Forces
                    </button>
                </div>

                {showDirectionCosines && (
                    <div className="directionCosinesTable">
                        <DirectionCosinesTable />
                    </div>
                )}
                {showTransformationMatrix && (
                    <div className="transformationMatrixTable">
                        <TransformationMatrixTable />
                    </div>
                )}
                {showElementStiffness && (
                    <div className="elementStiffnessMatrices">
                        <ElementStiffnessMatrices />
                    </div>
                )}
                {showGlobalStiffness && (
                    <div className="globalStiffnessMatrix">
                        <GlobalStiffnessMatrix />
                    </div>
                )}
                {showDOFIndices && (
                    <div className="dofIndicesTable">
                        <DofIndicesTable />
                    </div>
                )}
                {showDOFMapping && (
                    <div className="elementDOFMapping">
                        <ElementDOFMapping />
                    </div>
                )}
                {showAssembledMatrix && (
                    <div className="assembledMatrix">
                        <AssembledMatrix />
                    </div>
                )}
                {showBoundaryConditions && (
                    <div className="boundaryConditionsResult">
                        <BoundaryConditionsResult />
                    </div>
                )}
                {showDisplacements && (
                    <div className="solveDisplacement">
                        <SolveDisplacement />
                    </div>
                )}
                {showReactions && (
                    <div className="reactionForces">
                        <ReactionForces />
                    </div>
                )}
                {showAxialForces && (
                    <div className="internalAxialForces">
                        <InternalAxialForces />
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
