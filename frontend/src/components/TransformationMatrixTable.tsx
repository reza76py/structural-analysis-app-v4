import { useEffect, useState } from "react";
import axios from "axios";

type TransformationMatrixType = {
    id: number;
    startNode: string;
    endNode: string;
    T_matrix: number[][];
};

const TransformationMatrixTable = () => {
    const [data, setData] = useState<TransformationMatrixType[]>([]);

    useEffect(() => {
        const fetchTransformationMatrix = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/elements/transformation-matrix/",
                );
                setData(response.data.transformation_matrices);
            } catch (error) {
                console.error("Error fetching transformation matrices:", error);
            }
        };

        fetchTransformationMatrix();
    }, []);

    return (
        <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">
                Transformation Matrices per Element
            </h2>
            {data.map(({ id, startNode, endNode, T_matrix }) => (
                <div
                    key={id}
                    className="mb-4 border border-gray-300 p-2 rounded"
                >
                    <p className="font-semibold">
                        Element {id}: {startNode} → {endNode}
                    </p>
                    <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
                        <tbody>
                            {T_matrix.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((value, colIndex) => (
                                        <td
                                            key={colIndex}
                                            className="border px-2 py-1 text-center"
                                        >
                                            {value.toFixed(5)}
                                        </td>
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

export default TransformationMatrixTable;
