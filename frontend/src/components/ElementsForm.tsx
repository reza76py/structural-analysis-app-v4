import { FC, useState, useEffect } from "react";
import "../styles/styles_elementsForm.css";
import axios from "axios";

type NodeType = {
    id: number;
    x: number;
    y: number;
    z: number;
};

type ElementType = {
    id: number;
    startNode: string;
    endNode: string;
    length: number;
};

type ElementsFormProps = {
    nodes: NodeType[];
};

const ElementsForm: FC<ElementsFormProps> = ({ nodes }) => {
    const [selectedStartNode, setSelectedStartNode] = useState<string>("");
    const [selectedEndNode, setSelectedEndNode] = useState<string>("");
    const [dbElements, setDbElements] = useState<ElementType[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showForm, setShowForm] = useState(true); // ✅ Hide form after saving

    // ✅ Fetch saved elements from MySQL
    const fetchElements = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/elements/");
            setDbElements(response.data.elements);
        } catch (error) {
            console.error("Error fetching elements:", error);
        }
    };

    useEffect(() => {
        fetchElements();
    }, []);

    // ✅ Hide form when elements exist
    useEffect(() => {
        if (dbElements.length > 0) {
            setShowForm(false);
        }
    }, [dbElements]);

    // Filter nodes for "End Node" dropdown to exclude the selected Start Node
    const filteredEndNodes = nodes.filter(({ x, y, z }) => `${x},${y},${z}` !== selectedStartNode);

    // ✅ Save elements to MySQL
    const handleSaveElement = async () => {
        if (!selectedStartNode || !selectedEndNode) {
            alert("Please select both start and end nodes.");
            return;
        }

        setIsSaving(true);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/elements/", {
                startNode: selectedStartNode,
                endNode: selectedEndNode,
            });

            if (response.status === 201) {
                fetchElements(); // ✅ Refresh elements list after saving
                setShowForm(false); // ✅ Hide form after saving
            }
        } catch (error) {
            console.error("Error saving element:", error);
        }

        setTimeout(() => setIsSaving(false), 500);
    };

    // ✅ Delete All Elements from MySQL
    const handleDeleteAllElements = async () => {
        setIsDeleting(true);
        try {
            await axios.delete("http://127.0.0.1:8000/api/elements/");
            setDbElements([]);
            setShowForm(true); // ✅ Show form again when all elements are deleted
        } catch (error) {
            console.error("Error deleting elements:", error);
        }
        setTimeout(() => setIsDeleting(false), 500);
    };

    return (
        <div className="elements-form-container">
            {/* ✅ Show form only if no elements exist */}
            {showForm && (
                <>
                    <h2 className="elements-title">Create Elements</h2>
                    <p>Select two nodes to form an element.</p>

                    <label>Start Node:</label>
                    <select className="select-group" onChange={(e) => setSelectedStartNode(e.target.value)} value={selectedStartNode}>
                        <option value="">Select Start Node</option>
                        {nodes.map(({ x, y, z }) => (
                            <option key={`${x},${y},${z}`} value={`${x},${y},${z}`}>
                                ({x}, {y}, {z})
                            </option>
                        ))}
                    </select>

                    <label>End Node:</label>
                    <select className="select-group" onChange={(e) => setSelectedEndNode(e.target.value)} value={selectedEndNode}>
                        <option value="">Select End Node</option>
                        {filteredEndNodes.map(({ x, y, z }) => (
                            <option key={`${x},${y},${z}`} value={`${x},${y},${z}`}>
                                ({x}, {y}, {z})
                            </option>
                        ))}
                    </select>

                    <button className="save-element-btn" onClick={handleSaveElement}>
                        {isSaving ? "Saving..." : "Save Element"}
                    </button>
                </>
            )}

            {/* ✅ Show Saved Elements as Text from MySQL */}
            {dbElements.length > 0 && (
                <>
                    <h3 className="db-elements-list">Saved Elements:</h3>
                    <ul className="elements-list">
                        {dbElements.map(({ id, startNode, endNode, length }) => (
                            <li key={id} className="element-item">
                                ({startNode} → {endNode}) - Length: {length.toFixed(2)}
                            </li>
                        ))}
                    </ul>

                    <button className="delete-all-elements-btn" onClick={handleDeleteAllElements}>
                        {isDeleting ? "Deleting..." : "Delete All Elements"}
                    </button>
                </>
            )}
        </div>
    );
};

export default ElementsForm;
