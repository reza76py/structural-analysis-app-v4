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
    area: number;
    youngs_modulus: number;
};

type ElementsFormProps = {
    nodes: NodeType[];
    onUpdate: (elements: ElementType[]) => void;
};

const ElementsForm: FC<ElementsFormProps> = ({ nodes, onUpdate }) => {
    const [selectedNodes, setSelectedNodes] = useState({
        start: "",
        end: "",
    });
    const [dbElements, setDbElements] = useState<ElementType[]>([]);
    const [loadingState, setLoadingState] = useState({
        saving: false,
        deleting: false,
    });
    const [showForm, setShowForm] = useState(true);

    const [elementProps, setElementProps] = useState({
        area: 1.0,
        youngs_modulus: 1.0,
    });

    // Fetch elements from API
    const fetchElements = async (): Promise<void> => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/elements/",
            );
            setDbElements(response.data.elements);
            onUpdate(response.data.elements); // Update parent component
        } catch (error) {
            console.error("Error fetching elements:", error);
        }
    };

    // Handle node selection changes
    const handleNodeSelection = (
        e: React.ChangeEvent<HTMLSelectElement>,
        nodeType: "start" | "end",
    ): void => {
        setSelectedNodes((prev) => ({ ...prev, [nodeType]: e.target.value }));
    };

    // Save new element
    const persistElement = async (): Promise<void> => {
        if (!selectedNodes.start || !selectedNodes.end) {
            alert("Please select both start and end nodes.");
            return;
        }

        // Check for duplicates
        const exists = dbElements.some(
            (element) =>
                (element.startNode === selectedNodes.start &&
                    element.endNode === selectedNodes.end) ||
                (element.startNode === selectedNodes.end &&
                    element.endNode === selectedNodes.start),
        );

        if (exists) {
            alert("This element already exists!");
            return;
        }

        setLoadingState((prev) => ({ ...prev, saving: true }));

        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/api/elements/",
                {
                    startNode: selectedNodes.start,
                    endNode: selectedNodes.end,
                    area: elementProps.area,
                    youngs_modulus: elementProps.youngs_modulus,
                },
            );

            if (response.status === 201) {
                await fetchElements();
                setSelectedNodes({ start: "", end: "" });
            }
        } catch (error) {
            console.error("Error saving element:", error);
        } finally {
            setTimeout(
                () => setLoadingState((prev) => ({ ...prev, saving: false })),
                500,
            );
        }
    };

    // Delete all elements
    const deleteAllElements = async (): Promise<void> => {
        setLoadingState((prev) => ({ ...prev, deleting: true }));

        try {
            await axios.delete("http://127.0.0.1:8000/api/elements/");
            setDbElements([]);
            onUpdate([]); // Fixed prop name here
            setShowForm(true);
        } catch (error) {
            console.error("Error deleting elements:", error);
        } finally {
            setTimeout(
                () => setLoadingState((prev) => ({ ...prev, deleting: false })),
                500,
            );
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchElements();
    }, []);

    // Filter end nodes to exclude selected start node
    const filteredEndNodes = nodes.filter(
        ({ x, y, z }) => `${x},${y},${z}` !== selectedNodes.start,
    );

    return (
        <div className="elements-form-container">
            {showForm && (
                <>
                    <h2 className="form-title">Create Elements</h2>
                    <p className="db-nodes-list">
                        Select two nodes to form an element.
                    </p>

                    <div className="input-group">
                        <select
                            value={selectedNodes.start}
                            onChange={(e) => handleNodeSelection(e, "start")}
                            disabled={loadingState.saving}
                        >
                            <option value="">Select Start Node</option>
                            {nodes.map(({ x, y, z }) => (
                                <option
                                    key={`${x},${y},${z}`}
                                    value={`${x},${y},${z}`}
                                >
                                    ({x}, {y}, {z})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <select
                            value={selectedNodes.end}
                            onChange={(e) => handleNodeSelection(e, "end")}
                            disabled={loadingState.saving}
                        >
                            <option value="">Select End Node</option>
                            {filteredEndNodes.map(({ x, y, z }) => (
                                <option
                                    key={`${x},${y},${z}`}
                                    value={`${x},${y},${z}`}
                                >
                                    ({x}, {y}, {z})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Area (A):</label>
                        <input
                            type="number"
                            step="0.01"
                            value={elementProps.area}
                            onChange={(e) =>
                                setElementProps({
                                    ...elementProps,
                                    area: parseFloat(e.target.value) || 1,
                                })
                            }
                        />
                    </div>

                    <div className="input-group">
                        <label>Young's Modulus (E):</label>
                        <input
                            type="number"
                            step="0.01"
                            value={elementProps.youngs_modulus}
                            onChange={(e) =>
                                setElementProps({
                                    ...elementProps,
                                    youngs_modulus:
                                        parseFloat(e.target.value) || 1,
                                })
                            }
                        />
                    </div>

                    <div className="action-buttons">
                        <button
                            className="save-nodes-btn"
                            onClick={persistElement}
                            disabled={
                                loadingState.saving ||
                                !selectedNodes.start ||
                                !selectedNodes.end
                            }
                        >
                            {loadingState.saving ? "Saving..." : "Add Element"}
                        </button>
                        <button
                            className="secondary-btn"
                            onClick={() => setShowForm(false)}
                        >
                            Close Form
                        </button>
                    </div>
                </>
            )}

            {dbElements.length > 0 && (
                <div className="saved-records">
                    <h3 className="db-nodes-list">Saved Elements:</h3>
                    <ul className="nodes-list">
                        {dbElements.map(
                            ({
                                id,
                                startNode,
                                endNode,
                                length,
                                area,
                                youngs_modulus,
                            }) => (
                                <li key={id} className="element-item">
                                    <span className="element-pair">
                                        ({startNode} → {endNode})
                                    </span>
                                    <span className="element-length">
                                        Length: {length.toFixed(2)} | A: {area}{" "}
                                        | E: {youngs_modulus}
                                    </span>
                                </li>
                            ),
                        )}
                    </ul>

                    <button
                        className="delete-all-btn"
                        onClick={deleteAllElements}
                        disabled={loadingState.deleting}
                    >
                        {loadingState.deleting
                            ? "Deleting..."
                            : "Delete All Elements"}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ElementsForm;
