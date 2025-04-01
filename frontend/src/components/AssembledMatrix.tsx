import { FC, useState, useEffect } from "react";
import axios from "axios";

const AssembledMatrix: FC = () => {
  const [matrix, setMatrix] = useState<number[][]>([]);

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/assemble-global-stiffness/");
        setMatrix(response.data.matrix); // We'll adjust this key next step based on API response shape
      } catch (error) {
        console.error("Failed to fetch matrix:", error);
      }
    };

    fetchMatrix();
  }, []);

  return (
    <div>
      <h2 className="form-title">Assembled Global Stiffness Matrix [K]</h2>
      <table className="matrix-table">
        <tbody>
          {matrix.map((row, i) => (
            <tr key={i}>
              {row.map((val, j) => (
                <td key={j}>{val.toFixed(2)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AssembledMatrix;
