import ElementsForm from "./ElementsForm.tsx";
import { ChangeEvent, useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles_nodesForm.css";
import "../styles/styles_elementsForm.css";

type NodeType = {
    id: number;
    x: number;
    y: number;
    z: number;
 }

 type CoordinatesType = {
    x: string;
    y: string;
    z: string;
 }

const NodesForm = () => {
    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [coordinates, setCoordinates] = useState<CoordinatesType>({x: "", y: "", z: ""});
    const [dbNodes, setDbNodes] = useState<NodeType[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showElementForm, setShowElementForm] = useState(false);


    // Handle input changes
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCoordinates({...coordinates, [e.target.name]: e.target.value});
    };


    // Add node to the list
    const handleAddNode = (): void => {
        const {x, y, z} = coordinates;
        if (x === "" || y === "" || z === "") {
            alert("Please enter all coordinates");
            return;
        }
        setNodes([...nodes, {id: nodes.length + 1, x: parseInt(x), y: parseInt(y), z: parseInt(z)}]);
        setCoordinates({x: "", y: "", z: ""});
    };


    // Fetch saved nodes from MySQL
    const fetchNodes = async(): Promise<void> => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/nodes/");
            setDbNodes(response.data);
            
        } catch (error) {
            console.error("Error fetching nodes:", error);
        }
    };

    useEffect(() => { fetchNodes(); }, []);


    // Delete a node from the list
    const handleDeleteNode = (id: number): void => {
        const updatedNodes = nodes.filter((node) => node.id !== id);
        const reindexedNodes = updatedNodes.map((node, index) => ({...node, id: index + 1}));
        setNodes(reindexedNodes);
    };

    // Save nodes to MySQL
    const handleSaveNodes = async (): Promise<void> => {
        if (nodes.length === 0) return;

        setIsSaving(true);  // ✅ Show "Saving..."

        try {
        const response = await axios.post("http://127.0.0.1:8000/api/nodes/", { nodes });

        if (response.status === 201) {
            setNodes([]); // Clear nodes after successful save
            fetchNodes();  // ✅ Fetch updated nodes list from DB
        }
        } catch (error) {
        console.error("Error saving nodes:", error);
        }
        // ✅ Delay hiding "Saving..." for 500ms
        setTimeout(() => setIsSaving(false), 500);
    };

    // DELETE ALL Nodes from MySQL
    const handleDeleteAllNodes = async (): Promise<void> => {
        setIsDeleting(true);  // ✅ Show "Deleting..."
        try {
            await axios.delete("http://127.0.0.1:8000/api/nodes/");
            setDbNodes([]);  // ✅ Immediately clears saved nodes
            setNodes([]);  // ✅ Clears any unsaved input nodes too
            setShowElementForm(false);  // Hide element form when deleting all nodes
        } catch (error) {
            console.error("Error deleting nodes:", error);
        }

        // ✅ Delay hiding "Deleting..." for 500ms
        setTimeout(() => setIsDeleting(false), 500);
    };

    
    return (
        <div className="nodes-form-container">
            {!showElementForm && <h2 className="form-title">Enter Node Coordinates</h2>}

            {!showElementForm && (
                <div>
                    <input className="input-group" type="number" name="x" placeholder="x" value={coordinates.x} onChange={handleInputChange} />
                    <input className="input-group" type="number" name="y" placeholder="y" value={coordinates.y} onChange={handleInputChange} />
                    <input className="input-group" type="number" name="z" placeholder="z" value={coordinates.z} onChange={handleInputChange} />
                    <button className="add-node-btn" onClick={handleAddNode}>Add Node</button>
                </div>
            )}
            

            <ul className="nodes-list">
                {nodes.map(({id, x, y, z}) => (
                    <li key={id} className="node-item">
                        Node {id}: ({x}, {y}, {z})
                        <button className="delete-node-btn" onClick={() => handleDeleteNode(id)}>X</button>

                    </li>
                ))}
            </ul>

            {nodes.length > 0 && (
                <button className="save-nodes-btn" onClick={handleSaveNodes}>
                    {isSaving ? "Saving..." : "Save Nodes"}
                </button>
            )}
            
            {dbNodes.length > 0 && (
                <>
                    <h3 className="db-nodes-list">Saved Nodes:</h3>
                    <ul className="db-nodes-list">
                        {dbNodes.map(({ id, x, y, z }) => (
                        <li key={id} className="db-node-item">
                            ({x}, {y}, {z})
                        </li>
                        ))}
                    </ul>

                    <button className="delete-all-btn" onClick={handleDeleteAllNodes}>
                        {isDeleting ? "Deleting..." : "Delete All Nodes"}
                    </button>    

                    {/* ✅ Add Element Button */}
                    <button className="add-element-btn" onClick={() => setShowElementForm(true)}>
                        Add Element
                    </button>            
                </>
            )}

            {/* ✅ Show Element Form Only If "Add Element" Button Was Clicked */}
            {showElementForm && <ElementsForm nodes={dbNodes} />}


        </div>
    );
};

export default NodesForm;