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

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/loads/",
                {
                    node_coordinate: selectedNode,
                    Fx: loadValues.Fx,
                    Fy: loadValues.Fy,
                    Fz: loadValues.Fz,
                },
            );

            const newLoads = [...loads, response.data];
            setLoads(newLoads);
            onUpdate(newLoads); // <-- Update parent
            setLoadValues({ Fx: 0, Fy: 0, Fz: 0 });
            setSelectedNode("");
        } catch (error) {
            console.error("Error saving load:", error);
            alert("❌ Failed to save load.");
        }
    };

    const handleDeleteAllLoads = async () => {
        if (!window.confirm("⚠️ Are you sure you want to delete all loads?"))
            return;

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
            <p className="db-nodes-list">Choose a node to apply a load:</p>

            <div className="input-group">
                <select value={selectedNode} onChange={handleNodeSelection}>
                    <option value="">Select a Node</option>
                    {nodes.map(({ x, y, z }) => (
                        <option key={`${x},${y},${z}`} value={`${x},${y},${z}`}>
                            ({x}, {y}, {z})
                        </option>
                    ))}
                </select>
            </div>

            {selectedNode && (
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

                    <button className="add-load-btn" onClick={handleAddLoad}>
                        <svg
                        className="w-6 h-6 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 64 32"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        >
                        
                        <line x1="8" y1="24" x2="56" y2="24" stroke="maroon" strokeWidth="3" />


                        <line x1="16" y1="5" x2="16" y2="22" />
                        <line x1="14" y1="20" x2="16" y2="22" />
                        <line x1="18" y1="20" x2="16" y2="22" />


                        <line x1="32" y1="5" x2="32" y2="22" />
                        <line x1="30" y1="20" x2="32" y2="22" />
                        <line x1="34" y1="20" x2="32" y2="22" />


                        <line x1="48" y1="5" x2="48" y2="22" />
                        <line x1="46" y1="20" x2="48" y2="22" />
                        <line x1="50" y1="20" x2="48" y2="22" />
                        </svg>

                        Add Load
                    </button>
                </div>
            )}

            {loads.length > 0 && (
                <div className="saved-loads">
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

            <button className="delete-all-btn" onClick={handleDeleteAllLoads}>
                Delete All Loads
            </button>
        </div>
    );
};

export default LoadsForm;
