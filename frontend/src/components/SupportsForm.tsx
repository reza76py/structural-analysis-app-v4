// import { FC, useState, useEffect } from "react";
// import axios from "axios";
// import "../styles/styles_supportsForm.css";

// type NodeType = {
//     id: number;
//     x: number;
//     y: number;
//     z: number;
// };

// type SupportType = {
//     id: number;
//     node_coordinate: string;
//     type: string;
// };
// const SupportsForm: FC = () => {
//     const [nodes, setNodes] = useState<NodeType[]>([]);
//     const [supports, setSupports] = useState<SupportType[]>([]);
//     const [selectedNode, setSelectedNode] = useState<string>("");
//     const [selectedType, setSelectedType] = useState<string>("Pinned"); // Default type
//     const [loading, setLoading] = useState<boolean>(false);

//     // Fetch nodes from API
//     useEffect(() => {
//         const fetchNodes = async () => {
//             try {
//                 const response = await axios.get("http://127.0.0.1:8000/api/nodes/");
//                 setNodes(response.data);
//             } catch (error) {
//                 console.error("Error fetching nodes:", error);
//             }
//         };

//         const fetchSupports = async () => {
//             try {
//                 const response = await axios.get("http://127.0.0.1:8000/api/supports/");
//                 setSupports(response.data);
//             } catch (error) {
//                 console.error("Error fetching supports:", error);
//             }
//         };

//         fetchNodes();
//         fetchSupports();
//     }, []);

//     // Handle node selection
//     const handleNodeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedNode(e.target.value);
//     };

//     // ✅ Handle support type selection
//     const handleTypeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
//         setSelectedType(e.target.value);
//     };

//     // ✅ Save support to the backend
//     const handleAddSupport = async () => {
//         if (!selectedNode) {
//             alert("Please select a node.");
//             return;
//         }

//         setLoading(true);

//         try {
//             const response = await axios.post("http://127.0.0.1:8000/api/supports/", {
//                 node_coordinate: selectedNode,
//                 type: selectedType,
//             });

//             setSupports([...supports, response.data]); // Update frontend list
//             setSelectedNode(""); // Reset dropdown selection
//         } catch (error) {
//             console.error("Error saving support:", error);
//         } finally {
//             setLoading(false);
//         }
//     };


//     // ✅ Delete all supports
//     const handleDeleteAllSupports = async () => {
//         setLoading(true);
//         try {
//             await axios.delete("http://127.0.0.1:8000/api/supports/");
//             setSupports([]); // Clear frontend list
//         } catch (error) {
//             console.error("Error deleting supports:", error);
//         } finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div className="supports-form-container">
//             <h2 className="form-title">Select Support Location</h2>
//             <p className="db-nodes-list">Choose a node to apply support:</p>

//             <div className="input-group">
//                 <select value={selectedNode} onChange={handleNodeSelection}>
//                     <option value="">Select a Node</option>
//                     {nodes.map(({ x, y, z }) => (
//                         <option key={`${x},${y},${z}`} value={`${x},${y},${z}`}>
//                             ({x}, {y}, {z})
//                         </option>
//                     ))}
//                 </select>
//             </div>

//             {/* Support Type Selection */}
//             <div className="input-group">
//                 <select value={selectedType} onChange={handleTypeSelection}>
//                     <option value="Pinned">Pinned</option>
//                     <option value="Fixed">Fixed</option>
//                     <option value="Roller">Roller</option>
//                 </select>
//             </div>

//             {/* Add Support Button */}
//             <button className="add-support-btn" onClick={handleAddSupport} disabled={loading}>
//                 {loading ? "Saving..." : "Add Support"}
//             </button>

//             {/* ✅ Display the saved supports */}
//             {supports.length > 0 && (
//                 <div className="saved-supports">
//                     <h3 className="db-nodes-list">Saved Supports:</h3>
//                     <ul className="supports-list">
//                         {supports.map(({ id, node_coordinate, type }) => (
//                             <li key={id} className="support-item">
//                                 <span className="support-node">Node: {node_coordinate}</span>
//                                 <span className="support-type">Type: {type}</span>
//                             </li>
//                         ))}
//                     </ul>

//                     {/* Delete All Supports */}
//                     <button className="delete-all-btn" onClick={handleDeleteAllSupports} disabled={loading}>
//                         {loading ? "Deleting..." : "Delete All Supports"}
//                     </button>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default SupportsForm;






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
    type: string;
};

const SupportsForm: FC = () => {
    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [supports, setSupports] = useState<SupportType[]>([]);
    const [selectedNode, setSelectedNode] = useState<string>("");
    const [selectedType, setSelectedType] = useState<string>("Pinned"); // Default type
    const [loading, setLoading] = useState<boolean>(false);

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
    };

    // ✅ Handle support type selection
    const handleTypeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedType(e.target.value);
    };

    // ✅ Save support to the backend
    const handleAddSupport = async () => {
        if (!selectedNode) {
            alert("Please select a node.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/supports/", {
                node_coordinate: selectedNode,
                type: selectedType,
            });

            setSupports([...supports, response.data]); // Update frontend list
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

            {/* Support Type Selection */}
            <div className="input-group">
                <select value={selectedType} onChange={handleTypeSelection}>
                    <option value="Pinned">Pinned</option>
                    <option value="Fixed">Fixed</option>
                    <option value="Roller">Roller</option>
                </select>
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
                        {supports.map(({ id, node_coordinate, type }) => (
                            <li key={id} className="support-item">
                                <span className="support-node">Node: {node_coordinate}</span>
                                <span className="support-type">Type: {type}</span>
                            </li>
                        ))}
                    </ul>

                    {/* Delete All Supports */}
                    <button className="delete-all-btn" onClick={handleDeleteAllSupports} disabled={loading}>
                        {loading ? "Deleting..." : "Delete All Supports"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SupportsForm;
