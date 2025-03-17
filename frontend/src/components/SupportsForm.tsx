import { FC, useState, useEffect } from "react";
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

const SupportsForm: FC = () => {
    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [supports, setSupports] = useState<SupportType[]>([]);
    const [selectedNode, setSelectedNode] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("Pinned"); // Default type
    const [loading, setLoading] = useState<boolean>(false);
    const [restrictions, setRestrictions] = useState({
        x: false,
        y: false,
        z: false,
    });

    // ✅ Fetch nodes from API
    useEffect(() => {
        const fetchNodes = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/nodes/");
                setNodes(response.data);
            } catch (error) {
                console.error("Error fetching nodes:", error);
            }
        };

        const fetchSupports = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/supports/");
                setSupports(response.data);
            } catch (error) {
                console.error("Error fetching supports:", error);
            }
        };

        fetchNodes();
        fetchSupports();
    }, []);

    // ✅ Handle node selection
    const handleNodeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedNode(e.target.value);
        console.log("Selected Node:", e.target.value);  // ✅ Debugging log
    };
    

    const handleToggle = (direction: "x" | "y" | "z") => {
        setRestrictions(prev => ({
            ...prev,
            [direction]: !prev[direction]  // Toggle between true/false
        }));
    };
    // ✅ Save support to the backend
    const handleAddSupport = async () => {
        if (!selectedNode) {
            alert("Please select a node.");
            return;
        }
    
        setLoading(true);
    
        try {
            console.log("Sending support:", { 
                node_coordinate: selectedNode, 
                x_restrained: restrictions.x, 
                y_restrained: restrictions.y, 
                z_restrained: restrictions.z 
            });  // ✅ Debug log
    
            const response = await axios.post("http://127.0.0.1:8000/api/supports/", {
                node_coordinate: selectedNode,
                x_restrained: restrictions.x,
                y_restrained: restrictions.y,
                z_restrained: restrictions.z,
            });
    
            console.log("Response:", response.data);  // ✅ Debug log
            setSupports([...supports, response.data]);
            setSelectedNode(""); // Reset dropdown selection
        } catch (error) {
            console.error("Error saving support:", error);
        } finally {
            setLoading(false);
        }
    };
    

    // ✅ Delete all supports
    const handleDeleteAllSupports = async () => {
        setLoading(true);
        try {
            await axios.delete("http://127.0.0.1:8000/api/supports/");
            setSupports([]); // Clear frontend list
        } catch (error) {
            console.error("Error deleting supports:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="supports-form-container">
            <h2 className="form-title">Select Support Location</h2>
            <p className="db-nodes-list">Choose a node to apply support:</p>

            {/* Node Selection Dropdown */}
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




            {/* Add Support Button */}
            <button className="add-support-btn" onClick={handleAddSupport} disabled={loading}>
                {loading ? "Saving..." : "Add Support"}
            </button>

            {/* Saved Supports List */}
            {supports.length > 0 && (
                <div className="saved-supports">
                    <h3 className="db-nodes-list">Saved Supports:</h3>
                    <ul className="supports-list">
                        {supports.map(({ id, node_coordinate, x_restrained, y_restrained, z_restrained }) => (
                            <li key={id} className="support-item">
                                <span className="support-node">Node: {node_coordinate}</span>
                                <div className="support-restrictions">
                                    <span className={x_restrained ? "active" : ""}>X</span>
                                    <span className={y_restrained ? "active" : ""}>Y</span>
                                    <span className={z_restrained ? "active" : ""}>Z</span>
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
