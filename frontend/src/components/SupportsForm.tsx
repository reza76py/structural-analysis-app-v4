import { FC, useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles_supportsForm.css";

type NodeType = {
    id: number;
    x: number;
    y: number;
    z: number;
};

const SupportsForm: FC = () => {
    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [selectedNode, setSelectedNode] = useState<string>("");

    // Fetch nodes from API
    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/nodes/");
                setNodes(response.data);
            } catch (error) {
                console.error("Error fetching nodes:", error);
            }
        };

        fetchNodes();
    }, []);

    // Handle node selection
    const handleNodeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedNode(e.target.value);
    };

    // Handle adding support
    const handleAddSupport = () => {
        if (!selectedNode) {
            alert("Please select a node.");
            return;
        }
        console.log("Selected Support Node:", selectedNode);
    };

    return (
        <div className="supports-form-container">
            <h2 className="form-title">Select Support Location</h2>
            <p className="db-nodes-list">Choose a node to apply support:</p>

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

            <button className="add-support-btn" onClick={handleAddSupport}>
                Add Support
            </button>
        </div>
    );
};

export default SupportsForm;
