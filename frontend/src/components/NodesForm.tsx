import { ChangeEvent, useState } from "react";
import axios from "axios";
import "../styles/styles_nodesForm.css";

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

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCoordinates({...coordinates, [e.target.name]: e.target.value});
    };

    const handleAddNode = (): void => {
        const {x, y, z} = coordinates;
        if (x === "" || y === "" || z === "") {
            alert("Please enter all coordinates");
            return;
        }
        setNodes([...nodes, {id: nodes.length + 1, x: parseInt(x), y: parseInt(y), z: parseInt(z)}]);
        setCoordinates({x: "", y: "", z: ""});
    };

    const handleDeleteNode = (id: number): void => {
        const updatedNodes = nodes.filter((node) => node.id !== id);
        const reindexedNodes = updatedNodes.map((node, index) => ({...node, id: index + 1}));
        setNodes(reindexedNodes);
    };



    return (
        <div className="nodes-form-container">
            <h2 className="form-title">Enter Node Coordinates</h2>
            <div>
                <input className="input-group" type="number" name="x" placeholder="x" value={coordinates.x} onChange={handleInputChange} />
                <input className="input-group" type="number" name="y" placeholder="y" value={coordinates.y} onChange={handleInputChange} />
                <input className="input-group" type="number" name="z" placeholder="z" value={coordinates.z} onChange={handleInputChange} />
                <button className="add-node-btn" onClick={handleAddNode}>Add Node</button>
            </div>

            <ul className="nodes-list">
                {nodes.map(({id, x, y, z}) => (
                    <li key={id} className="node-item">
                        Node {id}: ({x}, {y}, {z})
                        <button className="delete-node-btn" onClick={() => handleDeleteNode(id)}>X</button>

                    </li>
                ))}
            </ul>

        </div>
    );
};

export default NodesForm;