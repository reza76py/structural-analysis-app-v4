import { FC } from "react";

type NodeType = {
    id: number;
    x: number;
    y: number;
    z: number;
};

type ElementsFormProps = {
    nodes: NodeType[]; // ✅ Receive nodes directly from NodesForm.tsx
};

const ElementsForm: FC<ElementsFormProps> = ({ nodes }) => {
    return (
        <div className="elements-form-container">
            <h2 className="elements-title">Create Elements</h2>
            <p>Select two nodes to form an element.</p>

            {/* ✅ Display dropdowns directly from received nodes */}
            <label>Start Node:</label>
            <select>
                {nodes.map(({ id }) => (
                    <option key={id} value={id}>
                        Node {id}
                    </option>
                ))}
            </select>

            <label>End Node:</label>
            <select>
                {nodes.map(({ id }) => (
                    <option key={id} value={id}>
                        Node {id}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ElementsForm;
