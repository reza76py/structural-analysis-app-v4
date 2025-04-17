import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import { motion } from "framer-motion";
import "../styles/styles_App.css";

// Import all your components
import DirectionCosinesTable from "./DirectionCosinesTable";
import TransformationMatrixTable from "./TransformationMatrixTable";
import ElementStiffnessMatrices from "./ElementStiffnessMatrices";
import GlobalStiffnessMatrix from "./GlobalStiffnessMatrix";
import DofIndicesTable from "./DofIndicesTable";
import ElementDOFMapping from "./ElementDOFMapping";
import AssembledMatrix from "./AssembledMatrix";
import BoundaryConditionsResult from "./BoundaryConditionsResult";
import SolveDisplacement from "./SolveDisplacement";
import ReactionForces from "./ReactionForces";
import InternalAxialForces from "./InternalAxialForces";

import "../styles/styles_AppResult/styles_AppResult.css";
import "../styles/styles_AppResult/styles_DirectionCosinesTable.css";

// Define result items configuration
const resultItems = [
  { key: "directionCosines", label: "Direction Cosines", Component: DirectionCosinesTable },
  { key: "transformationMatrix", label: "Transformation Matrix", Component: TransformationMatrixTable },
  { key: "elementStiffness", label: "Element Stiffness", Component: ElementStiffnessMatrices },
  { key: "globalStiffness", label: "Global Stiffness", Component: GlobalStiffnessMatrix },
  { key: "dofIndices", label: "DOF Indices", Component: DofIndicesTable },
  { key: "dofMapping", label: "DOF Mapping", Component: ElementDOFMapping },
  { key: "assembledMatrix", label: "Assembled Matrix", Component: AssembledMatrix },
  { key: "boundaryConditions", label: "Boundary Conditions", Component: BoundaryConditionsResult },
  { key: "displacements", label: "Displacements", Component: SolveDisplacement },
  { key: "reactions", label: "Reactions", Component: ReactionForces },
  { key: "axialForces", label: "Axial Forces", Component: InternalAxialForces },
] as const;

const AppResult = () => {
  // State management
  const [showMenu, setShowMenu] = useState(false);
  const [openPanels, setOpenPanels] = useState<string[]>([]);
  
  // Refs management
  const menuRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<Record<string, React.RefObject<HTMLDivElement>>>({});

  // Panel control functions
  const openPanel = (key: string) => {
    if (!openPanels.includes(key)) {
      // Initialize ref if it doesn't exist
      if (!panelRefs.current[key]) {
        panelRefs.current[key] = React.createRef<HTMLDivElement>();
      }
      setOpenPanels(prev => [...prev, key]);
    }
  };

  const closePanel = (key: string) => {
    setOpenPanels(prev => prev.filter(k => k !== key));
  };

  return (
    <div className="result-container">
      {/* Toggle Button */}
      <div className="relative group mb-4">
        <button
          className="access-btn"
          onClick={() => setShowMenu(prev => !prev)}
          aria-label="Toggle results menu"
        >
          📊
        </button>
        <div className="tooltip-btn">Results</div>
      </div>

      {/* Results List Menu */}
      {showMenu && (
        <Draggable nodeRef={menuRef} handle=".form-drag-handle">
            <div ref={menuRef}>
            <motion.div
                className="form-section-list"
                style={{ width: "200px" }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
            >
                <div className="form-drag-handle">
                📋 Results List
                </div>
                <ul className="space-y-1 text-[10px] p-2">
                {resultItems.map((item) => (
                    <li
                    key={item.key}
                    className="bg-black/40 hover:bg-white/20 p-1 rounded cursor-pointer transition-colors"
                    onClick={() => openPanel(item.key)}
                    >
                    {item.label}
                    </li>
                ))}
                </ul>
                <button
                className="text-sm text-red-500 absolute top-1 right-1 hover:text-red-400 transition-colors"
                onClick={() => setShowMenu(false)}
                aria-label="Close menu"
                >
                ✕
                </button>
            </motion.div>
            </div>
        </Draggable>
        )}


      {/* Results Panels */}
      {resultItems.map(({ key, label, Component }) => 
        openPanels.includes(key) && (
          <Draggable
            key={key}
            nodeRef={panelRefs.current[key]}
            handle=".form-drag-handle"
          >
            
            <div ref={panelRefs.current[key]}>
                <motion.div
                ref={panelRefs.current[key]}
                className="form-section-tables"
                style={{ width: "360px" }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                >
                <div className="form-drag-handle cursor-move font-bold text-center mb-2 p-2">
                    {label}
                </div>
                <button
                    className="text-sm text-red-500 absolute top-1 right-1 hover:text-red-400 transition-colors"
                    onClick={() => closePanel(key)}
                    aria-label={`Close ${label} panel`}
                >
                    ✕
                </button>
                <div className="p-2 overflow-auto max-h-[70vh]">
                    <Component />
                </div>
                </motion.div>
            </div>
            

          </Draggable>
        )
      )}
    </div>
  );
};

export default AppResult;