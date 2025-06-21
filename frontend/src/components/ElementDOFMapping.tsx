import React from "react";
import { FC, useEffect, useState } from "react";
import axios from "axios";

type ElementDOF = {
    id: number;
    startNode: string;
    endNode: string;
    dof_indices: number[];
};

const ElementDOFMappingTable: FC = () => {
    const [data, setData] = useState<ElementDOF[]>([]);

    // ⚠️ Ensure we use a consistent node-to-index mapping
    const [nodeOrder, setNodeOrder] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // 🟢 Fetch all DOF indices for elements
                const dofRes = await axios.get(
                    "http://127.0.0.1:8000/api/dof-indices/",
                );
                const elementDOFs: ElementDOF[] = dofRes.data.dof_indices;

                // 🟢 Get all nodes to determine ordering
                const nodesRes = await axios.get(
                    "http://127.0.0.1:8000/api/nodes/",
                );
                const coords = nodesRes.data.map(
                    (n: { x: number; y: number; z: number }) =>
                        `${n.x},${n.y},${n.z}`,
                );

                setData(elementDOFs);
                setNodeOrder(coords);
            } catch (error) {
                console.error("Error loading DOF mapping:", error);
            }
        };

        fetchData();
    }, []);

    // 🧠 Helper: get node number (1-based) from coordinate string
    const getNodeNumber = (coord: string): number => {
        return nodeOrder.indexOf(coord) + 1;
    };

    return (
        <div className="transformation-matrix-section">
            <h2 className="form-title">Element-to-Global DOF Mapping</h2>
            <table className="matrix-table">
                <thead>
                    <tr>
                        <th>Element</th>
                        <th>Nodes</th>
                        <th>DOFs Involved</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(({ id, startNode, endNode, dof_indices }) => (
                        <tr key={id}>
                            <td className="bg-gray-600">{id}</td>
                            <td className="bg-gray-600">
                                {getNodeNumber(startNode)} →{" "}
                                {getNodeNumber(endNode)}
                            </td>
                            <td className="bg-gray-600">
                                [{dof_indices.map((dof) => dof + 1).join(", ")}]
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ElementDOFMappingTable;
