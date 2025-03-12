import { FC, useState } from "react";
import "../styles/styles_elementsForm.css";
import axios from "axios";

type NodeType = {
    id: number;
    x: number;
    y: number;
    z: number;
};

type ElementsFormProps = {
    nodes: NodeType[];
};

const ElementsForm: FC<ElementsFormProps> = ({ nodes }) => {
    const [selectedStartNode, setSelectedStartNode] = useState<string>("");
    const [selectedEndNode, setSelectedEndNode] = useState<string>("");

    // Filter nodes for the "End Node" dropdown to exclude the selected Start Node
    const filteredEndNodes = nodes.filter(({ x, y, z }) => `${x},${y},${z}` !== selectedStartNode);


    // Send the selected nodes to backend
    const handleCreateElement  = async () => {
        if (!selectedStartNode || !selectedEndNode) {
            alert("Please select both start and end nodes.");
            return;
        }
        try {
            const response = await axios.post("http://127.0.0.1:8000/api/elements/", {
                startNode: selectedStartNode,
                endNode: selectedEndNode,
            });
            if (response.status === 201) {
                setSelectedStartNode("");
                setSelectedEndNode("");
            }
        } catch (error) {
            console.error("Error creating element:", error);
        }

    };

    return (
        <div className="elements-form-container">
            <h2 className="elements-title">Create Elements</h2>
            <p>Select two nodes to form an element.</p>

            {/* Start Node Dropdown */}
            <label>Start Node:</label>
            <select onChange={(e) => setSelectedStartNode(e.target.value)}>
                <option value={selectedStartNode}>Select Start Node</option>
                {nodes.map(({ x, y, z }) => (
                    <option key={`${x},${y},${z}`} value={`${x},${y},${z}`}>
                        ({x}, {y}, {z})
                    </option>
                ))}
            </select>

            {/* End Node Dropdown */}
            <label>End Node:</label>
            <select onChange={(e) => setSelectedEndNode(e.target.value)}>
                <option value={selectedEndNode}>Select End Node</option>
                {filteredEndNodes.map(({ x, y, z }) => (
                    <option key={`${x},${y},${z}`} value={`${x},${y},${z}`}>
                        ({x}, {y}, {z})
                    </option>
                ))}
            </select>

            <button className="create-element-btn" onClick={handleCreateElement}>
                Create Element
            </button>
        </div>
    );
};

export default ElementsForm;
