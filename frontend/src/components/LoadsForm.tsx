import { FC, useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles_loadsForm.css";

type NodeType = {
    id: number;
    x: number;
    y: number;
    z: number;
};

const LoadsForm: FC = () => {
    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [selectedNode, setSelectedNode] = useState<string>("");
    const [loadValues, setLoadValues] = useState({ Fx: 0, Fy: 0, Fz: 0 });
    const [loads, setLoads] = useState<LoadType[]>([]);


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

        fetchNodes();
    }, []);

    useEffect(() => {
        const fetchLoads = async () => {
            try {
                const response = await axios.get("http://127.0.0.1:8000/api/loads/");
                setLoads(response.data);
            } catch (error) {
                console.error("Error fetching loads:", error);
            }
        };
    
        fetchLoads();
    }, []);
    

    // ✅ Handle node selection
    const handleNodeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedNode(e.target.value);
    };

    // ✅ Handle load input change
    const handleLoadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setLoadValues(prev => ({
            ...prev,
            [name]: parseFloat(value) || 0, // Convert input to number
        }));
    };


    const handleAddLoad = async () => {
        if (!selectedNode) {
            alert("❌ Please select a node.");
            return;
        }
    
        if (isNaN(loadValues.Fx) || isNaN(loadValues.Fy) || isNaN(loadValues.Fz)) {
            alert("❌ Load values must be numbers.");
            return;
        }
    
        try {
            console.log("Sending load:", {
                node_coordinate: selectedNode,
                Fx: loadValues.Fx,
                Fy: loadValues.Fy,
                Fz: loadValues.Fz,
            });
    
            const response = await axios.post("http://127.0.0.1:8000/api/loads/", {
                node_coordinate: selectedNode,
                Fx: loadValues.Fx,
                Fy: loadValues.Fy,
                Fz: loadValues.Fz,
            });
    
            console.log("Response:", response.data);
            setLoads([...loads, response.data]); // Add the new load to the list
            setLoadValues({ Fx: 0, Fy: 0, Fz: 0 });
            setSelectedNode("");
        } catch (error) {
            console.error("Error saving load:", error);
            alert("❌ Failed to save load. Check your inputs and try again.");
        }
    };
    



    const handleDeleteAllLoads = async () => {
        if (!window.confirm("⚠️ Are you sure you want to delete all loads? This action cannot be undone.")) {
            return;
        }
    
        try {
            await axios.delete("http://127.0.0.1:8000/api/loads/");
            setLoads([]); // Clear the loads list in frontend
        } catch (error) {
            console.error("Error deleting loads:", error);
            alert("❌ Failed to delete loads. Try again.");
        }
    };
    
    
    

    return (
        <div className="loads-form-container">
            <h2 className="form-title">Apply Loads</h2>
            <p className="db-nodes-list">Choose a node to apply a load:</p>

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

            {/* Load Inputs - Appear Only After Selecting a Node */}
            {selectedNode && (
                <div className="load-inputs">
                    <label>Fx:</label>
                    <input type="number" name="Fx" value={loadValues.Fx} onChange={handleLoadChange} />

                    <label>Fy:</label>
                    <input type="number" name="Fy" value={loadValues.Fy} onChange={handleLoadChange} />

                    <label>Fz:</label>
                    <input type="number" name="Fz" value={loadValues.Fz} onChange={handleLoadChange} />

                    <button className="add-load-btn" onClick={handleAddLoad}>
                        Add Load
                    </button>
                </div>
            )}

            {/* Saved Loads List */}
            {loads.length > 0 && (
                <div className="saved-loads">
                    <h3 className="db-nodes-list">Saved Loads:</h3>
                    <ul className="loads-list">
                        {loads.map(({ id, node_coordinate, Fx, Fy, Fz }) => (
                            <li key={id} className="load-item">
                                <span className="load-node">Node: {node_coordinate}</span>
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

            {/* Delete All Loads Button */}
            <button className="delete-all-btn" onClick={handleDeleteAllLoads}>
                Delete All Loads
            </button>


        </div>
    );
};

export default LoadsForm;
