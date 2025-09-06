import React from "react";
import { FC, useEffect, useState } from "react";
import axios from "axios";
import "../api/axiosInterceptor";


type StiffnessMatrix = {
    id: number;
    startNode: string;
    endNode: string;
    k_local: number[][];
};

const ElementStiffnessMatrices: FC = () => {
    const [matrices, setMatrices] = useState<StiffnessMatrix[]>([]);

    useEffect(() => {
        const fetchMatrices = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/elements/local-stiffness/",
                );
                setMatrices(response.data.local_stiffness_matrices);
            } catch (error) {
                console.error(
                    "Error fetching local stiffness matrices:",
                    error,
                );
            }
        };

        fetchMatrices();
    }, []);

    return (
        <div className="transformation-matrix-section">
            <h2 className="form-title">Local Stiffness Matrices per Element</h2>
            {matrices.map(({ id, startNode, endNode, k_local }) => (
                <div key={id} className="matrix-block bg-gray-600">
                    <h4>
                        Element {id} ({startNode} → {endNode})
                    </h4>
                    <table className="matrix-table bg-gray-600">
                        <tbody className="text-sm bg-gray-600">
                            {k_local.map((row, rowIndex) => (
                                <tr className="bg-gray-600" key={rowIndex}>
                                    {row.map((val, colIndex) => (
                                        <td className="bg-gray-600" key={colIndex}>{val.toFixed(3)}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}
        </div>
    );
};

export default ElementStiffnessMatrices;
