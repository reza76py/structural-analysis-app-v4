import React, { FC, useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles_loadsForm.css";

// ✅ Types
type NodeType = {
    id: number;
    x: number;
    y: number;
    z: number;
};

type LoadType = {
    id: number;
    node_coordinate: string;
    Fx: number;
    Fy: number;
    Fz: number;
};

// ✅ Props
interface LoadsFormProps {
    onUpdate: (loads: LoadType[]) => void;
}

// ✅ Component
const LoadsForm: FC<LoadsFormProps> = ({ onUpdate }) => {

    // START new state variables
    const [inputMode, setInputMode] = useState<"direct" | "angle">("direct");
    const [angleValues, setAngleValues] = useState({
    magnitude: 0,
    thetaX: 0,
    thetaY: 0,
    thetaZ: 0,
    });
    // END new state variables

    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [selectedNode, setSelectedNode] = useState<string>("");
    const [loadValues, setLoadValues] = useState({ Fx: 0, Fy: 0, Fz: 0 });
    const [loads, setLoads] = useState<LoadType[]>([]);

    // ✅ Fetch nodes
    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/nodes/",
                );
                setNodes(response.data);
            } catch (error) {
                console.error("Error fetching nodes:", error);
            }
        };

        fetchNodes();
    }, []);

    // ✅ Fetch loads
    useEffect(() => {
        const fetchLoads = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/loads/",
                );
                setLoads(response.data);
                onUpdate(response.data); // <-- Send to parent
            } catch (error) {
                console.error("Error fetching loads:", error);
            }
        };

        fetchLoads();
    }, [onUpdate]);

    const handleNodeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedNode(e.target.value);
    };

    const handleLoadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoadValues((prev) => ({
            ...prev,
            [name]: parseFloat(value) || 0,
        }));
    };



    const handleAddLoad = async () => {
        if (!selectedNode) {
            alert("❌ Please select a node.");
            return;
        }

        let Fx = 0, Fy = 0, Fz = 0;

        if (inputMode === "direct") {
            // Use Fx, Fy, Fz directly
            Fx = loadValues.Fx;
            Fy = loadValues.Fy;
            Fz = loadValues.Fz;
        } else {
            // Convert magnitude and angles to components
            const { magnitude, thetaX, thetaY, thetaZ } = angleValues;
            const radX = (thetaX * Math.PI) / 180;
            const radY = (thetaY * Math.PI) / 180;
            const radZ = (thetaZ * Math.PI) / 180;

            Fx = magnitude * Math.cos(radX);
            Fy = magnitude * Math.cos(radY);
            Fz = magnitude * Math.cos(radZ);
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/loads/", {
                node_coordinate: selectedNode,
                Fx,
                Fy,
                Fz,
            });

            const newLoads = [...loads, response.data];
            setLoads(newLoads);
            onUpdate(newLoads);

            // Reset forms
            setSelectedNode("");
            setLoadValues({ Fx: 0, Fy: 0, Fz: 0 });
            setAngleValues({ magnitude: 0, thetaX: 0, thetaY: 0, thetaZ: 0 });
        } catch (error) {
            console.error("Error saving load:", error);
            alert("❌ Failed to save load.");
        }
    };

    const handleDeleteAllLoads = async () => {
        if (!window.confirm("⚠️ Are you sure you want to delete all loads?")) return;

        try {
            await axios.delete("http://127.0.0.1:8000/api/loads/");
            setLoads([]);
            onUpdate([]); // <-- Clear visualization
        } catch (error) {
            console.error("Error deleting loads:", error);
            alert("❌ Failed to delete loads.");
        }
    };



    return (
        <div className="loads-form">
            <h2 className="form-title">Apply Loads</h2>

            <div>
                <select
                    className="input-group"
                    value={selectedNode}
                    onChange={handleNodeSelection}
                >
                    <option value="">Select a Node</option>
                    {nodes.map(({ x, y, z }) => (
                        <option key={`${x},${y},${z}`} value={`${x},${y},${z}`}>
                            ({x}, {y}, {z})
                        </option>
                    ))}
                </select>
            </div>

            {selectedNode && (
                <>
                    {/* 👇 Input Mode Toggle */}
                    <div className="input-mode-toggle mb-2 flex gap-2">
                        <button
                            onClick={() => setInputMode("direct")}
                            className={`px-2 py-1 rounded ${
                                inputMode === "direct"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-300"
                            }`}
                        >
                            🎯 Fx, Fy, Fz
                        </button>
                        <button
                            onClick={() => setInputMode("angle")}
                            className={`px-2 py-1 rounded ${
                                inputMode === "angle"
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-300"
                            }`}
                        >
                            📐 Magnitude + Angles
                        </button>
                    </div>

                    {/* 👇 Conditional Inputs */}
                    {inputMode === "direct" ? (
                        <div className="load-inputs">
                            <label>Fx:</label>
                            <input
                                type="number"
                                name="Fx"
                                value={loadValues.Fx}
                                onChange={handleLoadChange}
                            />
                            <label>Fy:</label>
                            <input
                                type="number"
                                name="Fy"
                                value={loadValues.Fy}
                                onChange={handleLoadChange}
                            />
                            <label>Fz:</label>
                            <input
                                type="number"
                                name="Fz"
                                value={loadValues.Fz}
                                onChange={handleLoadChange}
                            />
                        </div>
                    ) : (
                        <div className="load-inputs">
                            <label>Magnitude:</label>
                            <input
                                type="number"
                                name="magnitude"
                                value={angleValues.magnitude}
                                onChange={(e) =>
                                    setAngleValues((prev) => ({
                                        ...prev,
                                        magnitude: parseFloat(e.target.value) || 0,
                                    }))
                                }
                            />
                            <label>θx (deg):</label>
                            <input
                                type="number"
                                name="thetaX"
                                value={angleValues.thetaX}
                                onChange={(e) =>
                                    setAngleValues((prev) => ({
                                        ...prev,
                                        thetaX: parseFloat(e.target.value) || 0,
                                    }))
                                }
                            />
                            <label>θy (deg):</label>
                            <input
                                type="number"
                                name="thetaY"
                                value={angleValues.thetaY}
                                onChange={(e) =>
                                    setAngleValues((prev) => ({
                                        ...prev,
                                        thetaY: parseFloat(e.target.value) || 0,
                                    }))
                                }
                            />
                            <label>θz (deg):</label>
                            <input
                                type="number"
                                name="thetaZ"
                                value={angleValues.thetaZ}
                                onChange={(e) =>
                                    setAngleValues((prev) => ({
                                        ...prev,
                                        thetaZ: parseFloat(e.target.value) || 0,
                                    }))
                                }
                            />
                        </div>
                    )}

                    {/* 👇 Add Button */}
                    <button className="add-load-btn mt-2" onClick={handleAddLoad}>
                        ➕ Add Load
                    </button>
                </>
            )}

            {/* 👇 Saved Loads List */}
            {loads.length > 0 && (
                <div className="saved-loads mt-4">
                    <h3 className="db-nodes-list">Saved Loads:</h3>
                    <ul className="loads-list">
                        {loads.map(({ id, node_coordinate, Fx, Fy, Fz }) => (
                            <li key={id} className="load-item">
                                <span className="load-node">
                                    Node: {node_coordinate}
                                </span>
                                <div className="load-values">
                                    <span>Fx: {Fx} N</span>
                                    <span>Fy: {Fy} N</span>
                                    <span>Fz: {Fz} N</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 👇 Delete Button */}
            <button className="delete-all-btn" onClick={handleDeleteAllLoads}>
                Delete All Loads
            </button>
        </div>
    );

};

export default LoadsForm;
