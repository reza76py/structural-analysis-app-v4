import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import { motion } from "framer-motion";
import "../styles/styles_App.css";
import { Resizable } from "re-resizable";
import { createPortal } from "react-dom";

// ✅ Components
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

// ✅ Styles
import "../styles/styles_AppResult/styles_AppResult.css";
import "../styles/styles_AppResult/styles_DirectionCosinesTable.css";

// ✅ Result items
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
  const [showMenu, setShowMenu] = useState(false);
  const [openPanels, setOpenPanels] = useState<string[]>([]);
  const [maximizedPanels, setMaximizedPanels] = useState<string[]>([]);

  // ✅ FIXED: menuRef uses HTMLDivElement
  const menuRef = useRef<HTMLDivElement>(null!);

  // ✅ FIXED: panelRefs are refs to HTMLDivElement
  const panelRefs = useRef<Record<string, React.RefObject<HTMLDivElement | null>>>({});



  const openPanel = (key: string) => {
    if (!openPanels.includes(key)) {
        if (!panelRefs.current[key]) {
        panelRefs.current[key] = React.createRef<HTMLDivElement>(); // ✅ Correct type
        }
        setOpenPanels((prev) => [...prev, key]);
    }
  };

  const closePanel = (key: string) => {
    setOpenPanels((prev) => prev.filter((k) => k !== key));
  };

  const toggleMaximize = (key: string) => {
    setMaximizedPanels((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  const isPanelMaximized = (key: string) => maximizedPanels.includes(key);

  return (
    <div className="result-container">
      {/* Toggle Button */}
      <div className="relative group mb-4">
        <button className="access-btn" onClick={() => setShowMenu((prev) => !prev)} aria-label="Toggle results menu">
          📊
        </button>
        <div className="tooltip-btn">Results</div>
      </div>

      {/* Results Menu */}
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
              <div className="form-drag-handle">📋 Results List</div>
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

      {/* Result Panels */}
      {resultItems.map(({ key, label, Component }) => {
        const isMaximized = isPanelMaximized(key);

        return (
          openPanels.includes(key) && (
            <React.Fragment key={key}>
              {isMaximized &&
                createPortal(
                  <motion.div
                    className="fixed top-0 left-0 w-[100vw] h-[100vh] bg-black/90 z-[9999] p-4 overflow-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="form-drag-handle text-center font-bold mb-2">{label}</div>
                    <div className="absolute top-4 right-8">
                      <button onClick={() => toggleMaximize(key)} className="text-sm text-white hover:text-gray-300">
                        🗗
                      </button>
                    </div>
                    <button
                      className="text-sm text-red-500 absolute top-4 right-4 hover:text-red-400"
                      onClick={() => closePanel(key)}
                    >
                      ✕
                    </button>
                    <div className="p-2 overflow-auto h-[calc(100vh-4rem)]">
                      <Component />
                    </div>
                  </motion.div>,
                  document.body,
                )}

              {!isMaximized && (
                <Draggable
                    key={key}
                    nodeRef={panelRefs.current[key] as React.RefObject<HTMLElement>}
                    handle=".form-drag-handle"
                    >

                  <div ref={panelRefs.current[key]}>
                    <Resizable
                      defaultSize={{ width: 360, height: "auto" }}
                      minWidth={260}
                      minHeight={150}
                      enable={{ bottomRight: true, bottom: true, right: true }}
                      style={{ position: "relative" }}
                    >
                      <motion.div
                        className="form-section-tables"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                      >
                        <div className="form-drag-handle">{label}</div>
                        <div className="absolute top-1 right-8">
                          <button
                            onClick={() => toggleMaximize(key)}
                            className="text-sm text-white hover:text-gray-300"
                          >
                            🗖
                          </button>
                        </div>
                        <button
                          className="text-sm text-red-500 absolute top-1 right-1 hover:text-red-400"
                          onClick={() => closePanel(key)}
                        >
                          ✕
                        </button>
                        <div className="p-2 overflow-auto max-h-[70vh]">
                          <Component />
                        </div>
                      </motion.div>
                    </Resizable>
                  </div>
                </Draggable>
              )}
            </React.Fragment>
          )
        );
      })}
    </div>
  );
};

export default AppResult;















