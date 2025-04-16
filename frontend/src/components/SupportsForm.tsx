import React, { FC, useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles_supportsForm.css";

type NodeType = {
    id: number;
    x: number;
    y: number;
    z: number;
};

type SupportType = {
    id: number;
    node_coordinate: string;
    x_restrained: boolean;
    y_restrained: boolean;
    z_restrained: boolean;
};

interface SupportsFormProps {
    onUpdate: (supports: SupportType[]) => void;
}

const SupportsForm: FC<SupportsFormProps> = ({ onUpdate }) => {
    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [supports, setSupports] = useState<SupportType[]>([]);
    const [selectedNode, setSelectedNode] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [restrictions, setRestrictions] = useState({
        x: false,
        y: false,
        z: false,
    });

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

        const fetchSupports = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/supports/",
                );
                setSupports(response.data);
                onUpdate(response.data);
            } catch (error) {
                console.error("Error fetching supports:", error);
            }
        };

        fetchNodes();
        fetchSupports();
    }, []);

    const handleNodeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedNode(e.target.value);
    };

    const handleToggle = (direction: "x" | "y" | "z") => {
        setRestrictions((prev) => ({ ...prev, [direction]: !prev[direction] }));
    };

    const handleAddSupport = async () => {
        if (!selectedNode) {
            alert("Please select a node.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/supports/",
                {
                    node_coordinate: selectedNode,
                    x_restrained: restrictions.x,
                    y_restrained: restrictions.y,
                    z_restrained: restrictions.z,
                },
            );

            const newSupports = [...supports, response.data];
            setSupports(newSupports);
            onUpdate(newSupports);
            setSelectedNode("");
            setRestrictions({ x: false, y: false, z: false });
        } catch (error) {
            console.error("Error saving support:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAllSupports = async () => {
        setLoading(true);
        try {
            await axios.delete("http://127.0.0.1:8000/api/supports/");
            setSupports([]);
            onUpdate([]);
        } catch (error) {
            console.error("Error deleting supports:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="supports-form-container">
            <h2 className="form-title">Select Support Location</h2>
            <div>
                <select
                className="input-group"
                value={selectedNode} onChange={handleNodeSelection}>
                    <option value="">Select a Node</option>
                    {nodes.map(({ x, y, z }) => (
                        <option key={`${x},${y},${z}`} value={`${x},${y},${z}`} className="node-option">
                            ({x}, {y}, {z})
                        </option>
                    ))}
                </select>
            </div>

            <div className="toggle-group">
                <button
                    className={`toggle-btn ${restrictions.x ? "active" : ""}`}
                    onClick={() => handleToggle("x")}
                    type="button"
                >
                    X
                </button>
                <button
                    className={`toggle-btn ${restrictions.y ? "active" : ""}`}
                    onClick={() => handleToggle("y")}
                    type="button"
                >
                    Y
                </button>
                <button
                    className={`toggle-btn ${restrictions.z ? "active" : ""}`}
                    onClick={() => handleToggle("z")}
                    type="button"
                >
                    Z
                </button>
            </div>

            <button
                className="add-support-btn"
                onClick={handleAddSupport}
                disabled={loading}
                >
                {!loading && (
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
                )}
                {loading ? "Saving..." : "Add Support"}
            </button>

            <button
                className="delete-btn"
                onClick={handleDeleteAllSupports}
                disabled={loading}
            >
                {loading ? "Deleting..." : "Delete All Supports"}
            </button>

            {supports.length > 0 && (
                <div className="saved-supports">
                    <h3 className="text-white text-[10px] font-semibold mb-1">Saved Supports:</h3>
                    <ul className="supports-list">
                        {supports.map((support) => (
                            <li key={support.id} className="support-item">
                                <span>Node: {support.node_coordinate}</span>
                                <div className="support-restrictions">
                                    <span
                                        className={
                                            support.x_restrained ? "active" : ""
                                        }
                                    >
                                        X
                                    </span>
                                    <span
                                        className={
                                            support.y_restrained ? "active" : ""
                                        }
                                    >
                                        Y
                                    </span>
                                    <span
                                        className={
                                            support.z_restrained ? "active" : ""
                                        }
                                    >
                                        Z
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default SupportsForm;
