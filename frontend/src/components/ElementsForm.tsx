import { FC, useState, useEffect } from "react";
import axios from "axios";
import "../styles/styles_elementsForm.css";

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
    const [selectedNodes, setSelectedNodes] = useState({
        start: "",
        end: ""
    });
    const [dbElements, setDbElements] = useState<ElementType[]>([]);
    const [loadingState, setLoadingState] = useState({
        saving: false,
        deleting: false
    });
    const [showForm, setShowForm] = useState(true);

    const handleNodeSelection = (e: React.ChangeEvent<HTMLSelectElement>, nodeType: "start" | "end"): void => {
        setSelectedNodes(prev => ({ ...prev, [nodeType]: e.target.value }));
    };

    const resetSelections = (): void => {
        setSelectedNodes({ start: "", end: "" });
    };

    const fetchElements = async (): Promise<void> => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/elements/");
            setDbElements(response.data.elements);
        } catch (error) {
            console.error("Error fetching elements:", error);
        }
    };

    const persistElement = async (): Promise<void> => {
        if (!selectedNodes.start || !selectedNodes.end) {
            alert("Please select both start and end nodes.");
            return;
        }

        setLoadingState(prev => ({ ...prev, saving: true }));

        try {
            await axios.post("http://127.0.0.1:8000/api/elements/", {
                startNode: selectedNodes.start,
                endNode: selectedNodes.end,
            });
            await fetchElements();
            resetSelections();
        } catch (error) {
            console.error("Error saving element:", error);
        }

        setTimeout(() => setLoadingState(prev => ({ ...prev, saving: false })), 500);
    };

    const deleteAllElements = async (): Promise<void> => {
        setLoadingState(prev => ({ ...prev, deleting: true }));
        
        try {
            await axios.delete("http://127.0.0.1:8000/api/elements/");
            setDbElements([]);
            setShowForm(true);
        } catch (error) {
            console.error("Error deleting elements:", error);
        }

        setTimeout(() => setLoadingState(prev => ({ ...prev, deleting: false })), 500);
    };

    useEffect(() => {
        fetchElements();
    }, []);

    const filteredEndNodes = nodes.filter(({ x, y, z }) => 
        `${x},${y},${z}` !== selectedNodes.start
    );

    return (
        <div className="elements-form-container">
            {showForm && (
                <>
                    <h2 className="form-title">Create Elements</h2>
                    <p className="db-nodes-list">Select two nodes to form an element.</p>

                    <div className="input-group">
                        <select
                            value={selectedNodes.start}
                            onChange={(e) => handleNodeSelection(e, "start")}
                        >
                            <option value="">Select Start Node</option>
                            {nodes.map(({ x, y, z }) => (
                                <option key={`${x},${y},${z}`} value={`${x},${y},${z}`}>
                                    ({x}, {y}, {z})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <select
                            value={selectedNodes.end}
                            onChange={(e) => handleNodeSelection(e, "end")}
                        >
                            <option value="">Select End Node</option>
                            {filteredEndNodes.map(({ x, y, z }) => (
                                <option key={`${x},${y},${z}`} value={`${x},${y},${z}`}>
                                    ({x}, {y}, {z})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="action-buttons">
                        <button
                            className="save-nodes-btn"
                            onClick={persistElement}
                            disabled={loadingState.saving}
                        >
                            {loadingState.saving ? "Saving..." : "Add Element"}
                        </button>
                        <button
                            className="delete-all-btn"
                            onClick={() => setShowForm(false)}
                        >
                            Element Ended
                        </button>
                    </div>
                </>
            )}

            {dbElements.length > 0 && (
                <div className="saved-records">
                    <h3 className="db-nodes-list">Saved Elements:</h3>
                    <ul className="nodes-list">
                        {dbElements.map(({ id, startNode, endNode, length }) => (
                            <li key={id} className="node-item">
                                ({startNode} → {endNode}) - Length: {length.toFixed(2)}
                            </li>
                        ))}
                    </ul>

                    <button
                        className="delete-all-btn"
                        onClick={deleteAllElements}
                        disabled={loadingState.deleting}
                    >
                        {loadingState.deleting ? "Deleting..." : "Delete All Elements"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ElementsForm;