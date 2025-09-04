import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/styles_global_stiffness_per_elemen.css";

type ElementMatrix = {
    id: number;
    startNode: string;
    endNode: string;
    k_global: number[][];
};

const ElementGlobalStiffnessMatrices = () => {
    const [elementMatrices, setElementMatrices] = useState<ElementMatrix[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMatrices = async () => {
            try {
                const response = await axios.get(
                    "${API_URL}/api/elements/global-stiffness-per-element/",
                );
                setElementMatrices(
                    response.data.element_global_stiffness_matrices,
                );
            } catch (error) {
                console.error(
                    "Error fetching element-wise global stiffness matrices:",
                    error,
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMatrices();
    }, []);

    return (
        <div className="matrix-display">
            <h2 className="form-title bg-gray-600">
                Element-wise Global Stiffness Matrices
            </h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                elementMatrices.map((el) => (
                    <div key={el.id} className="matrix-block">
                        <h4>
                            Element {el.id}: ({el.startNode} → {el.endNode})
                        </h4>
                        <table className="matrix-table bg-gray-600">
                            <tbody>
                                {el.k_global.map((row, rowIndex) => (
                                    <tr className="bg-gray-600" key={rowIndex}>
                                        {row.map((val, colIndex) => (
                                            <td className="bg-gray-600" key={colIndex}>
                                                {val.toFixed(2)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ))
            )}
        </div>
    );
};

export default ElementGlobalStiffnessMatrices;
