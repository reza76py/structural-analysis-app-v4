import { ChangeEvent, useState, useEffect } from "react";
import axios from "axios";
import ElementsForm from "./ElementsForm";
import "../styles/styles_nodesForm.css";
import "../styles/styles_elementsForm.css";

type NodeType = {
    id: number;
    x: number;
    y: number;
    z: number;
};

type CoordinatesType = {
    x: string;
    y: string;
    z: string;
};

type NodesFormProps = {
    onUpdate: (
        nodes: Array<{ x: number; y: number; z: number }>,
        elements: Array<{ startNode: string; endNode: string }>
    ) => void;
};

const NodesForm = ({ onUpdate }: NodesFormProps) => {
    const [nodes, setNodes] = useState<NodeType[]>([]);
    const [coordinates, setCoordinates] = useState<CoordinatesType>({ x: "", y: "", z: "" });
    const [dbNodes, setDbNodes] = useState<NodeType[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showElementForm, setShowElementForm] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCoordinates({ ...coordinates, [e.target.name]: e.target.value });
    };

    const handleAddNode = (): void => {
        const { x, y, z } = coordinates;
        if (x === "" || y === "" || z === "") {
            alert("Please enter all coordinates");
            return;
        }
        const newNodes = [...nodes, { 
            id: nodes.length + 1, 
            x: parseInt(x), 
            y: parseInt(y), 
            z: parseInt(z) 
        }];
        setNodes(newNodes);
        setCoordinates({ x: "", y: "", z: "" });
    };

    const fetchNodes = async (): Promise<void> => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/nodes/");
            console.log("✅ Fetched Nodes from API:", response.data); // ✅ Debug log
            
            setDbNodes(response.data);
    
            // Update visualization with current elements
            onUpdate(
                response.data.map(n => ({ x: n.x, y: n.y, z: n.z })),
                [] // Initialize with empty elements
            );
        } catch (error) {
            console.error("❌ Error fetching nodes:", error);
        }
    };

    const handleDeleteNode = (id: number): void => {
        const updatedNodes = nodes.filter((node) => node.id !== id);
        const reindexedNodes = updatedNodes.map((node, index) => ({ ...node, id: index + 1 }));
        setNodes(reindexedNodes);
    };

    const handleSaveNodes = async (): Promise<void> => {
        if (nodes.length === 0) return;

        setIsSaving(true);
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/nodes/", { nodes });
            if (response.status === 201) {
                setNodes([]);
                await fetchNodes();
            }
        } catch (error) {
            console.error("Error saving nodes:", error);
        } finally {
            setTimeout(() => setIsSaving(false), 500);
        }
    };

    const handleDeleteAllNodes = async (): Promise<void> => {
        setIsDeleting(true);
        try {
            await axios.delete("http://127.0.0.1:8000/api/nodes/");
            setDbNodes([]);
            setNodes([]);
            setShowElementForm(false);
            onUpdate([], []); // Clear both nodes and elements
        } catch (error) {
            console.error("Error deleting nodes:", error);
        } finally {
            setTimeout(() => setIsDeleting(false), 500);
        }
    };

    useEffect(() => { 
        fetchNodes(); 
    }, []);

    return (
        <div className="nodes-form-container">
            {!showElementForm && <h2 className="form-title">Enter Node Coordinates</h2>}

            {!showElementForm && (
                <div>
                    <input className="input-group" type="number" name="x" placeholder="x" 
                        value={coordinates.x} onChange={handleInputChange} />
                    <input className="input-group" type="number" name="y" placeholder="y" 
                        value={coordinates.y} onChange={handleInputChange} />
                    <input className="input-group" type="number" name="z" placeholder="z" 
                        value={coordinates.z} onChange={handleInputChange} />
                    <button className="add-node-btn" onClick={handleAddNode}>
                        Add Node
                    </button>
                </div>
            )}

            <ul className="nodes-list">
                {nodes.map(({ id, x, y, z }) => (
                    <li key={id} className="node-item">
                        Node {id}: ({x}, {y}, {z})
                        <button className="delete-node-btn" onClick={() => handleDeleteNode(id)}>
                            X
                        </button>
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

                    <button className="add-element-btn" onClick={() => setShowElementForm(true)}>
                        Add Element
                    </button>
                </>
            )}

            {showElementForm && dbNodes.length > 0 && (
                <ElementsForm 
                    nodes={dbNodes} 
                    onUpdate={(elements) => {
                        // Convert elements to the correct format
                        const formattedElements = elements.map(e => ({
                            startNode: e.startNode,
                            endNode: e.endNode
                        }));
                        // Update visualization with latest nodes and elements
                        onUpdate(
                            dbNodes.map(n => ({ x: n.x, y: n.y, z: n.z })),
                            formattedElements
                        );
                    }}
                />
            )}
        </div>
    );
};

export default NodesForm;