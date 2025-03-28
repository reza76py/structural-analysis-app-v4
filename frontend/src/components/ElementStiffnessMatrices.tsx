import { FC, useEffect, useState } from "react";
import axios from "axios";

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
        const response = await axios.get("http://127.0.0.1:8000/api/elements/local-stiffness/");
        setMatrices(response.data.local_stiffness_matrices);
      } catch (error) {
        console.error("Error fetching local stiffness matrices:", error);
      }
    };

    fetchMatrices();
  }, []);

  return (
    <div className="transformation-matrix-section">
      <h2 className="form-title">Local Stiffness Matrices per Element</h2>
      {matrices.map(({ id, startNode, endNode, k_local }) => (
        <div key={id} className="matrix-block">
          <h4>Element {id} ({startNode} → {endNode})</h4>
          <table className="matrix-table">
            <tbody>
              {k_local.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((val, colIndex) => (
                    <td key={colIndex}>{val.toFixed(3)}</td>
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
