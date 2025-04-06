import { useEffect, useState } from "react";
import axios from "axios";

type DirectionCosineType = {
    id: number;
    startNode: string;
    endNode: string;
    cos_x: number;
    cos_y: number;
    cos_z: number;
    length: number;
};

const DirectionCosinesTable = () => {
    const [data, setData] = useState<DirectionCosineType[]>([]);

    useEffect(() => {
        const fetchDirectionCosines = async () => {
            try {
                const response = await axios.get(
                    "http://127.0.0.1:8000/api/elements/direction-cosines/",
                );
                setData(response.data.direction_cosines);
            } catch (error) {
                console.error("Error fetching direction cosines:", error);
            }
        };

        fetchDirectionCosines();
    }, []);

    return (
        <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">
                Direction Cosines per Element
            </h2>
            <table className="table-auto w-full border-collapse border border-gray-300 text-sm">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="border px-2 py-1">ID</th>
                        <th className="border px-2 py-1">Start Node</th>
                        <th className="border px-2 py-1">End Node</th>
                        <th className="border px-2 py-1">cosX</th>
                        <th className="border px-2 py-1">cosY</th>
                        <th className="border px-2 py-1">cosZ</th>
                        <th className="border px-2 py-1">Length</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(
                        ({
                            id,
                            startNode,
                            endNode,
                            cos_x,
                            cos_y,
                            cos_z,
                            length,
                        }) => (
                            <tr key={id}>
                                <td className="border px-2 py-1 text-center">
                                    {id}
                                </td>
                                <td className="border px-2 py-1 text-center">
                                    {startNode}
                                </td>
                                <td className="border px-2 py-1 text-center">
                                    {endNode}
                                </td>
                                <td className="border px-2 py-1 text-center">
                                    {cos_x}
                                </td>
                                <td className="border px-2 py-1 text-center">
                                    {cos_y}
                                </td>
                                <td className="border px-2 py-1 text-center">
                                    {cos_z}
                                </td>
                                <td className="border px-2 py-1 text-center">
                                    {length}
                                </td>
                            </tr>
                        ),
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DirectionCosinesTable;
