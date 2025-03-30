import { FC, useEffect, useState } from "react";
import axios from "axios";
import "../styles/styles_scene3D.css";

const AssembledMatrix: FC = () => {
  const [matrix, setMatrix] = useState<number[][]>([]);

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/elements/global-stiffness/");
        setMatrix(response.data.global_stiffness_matrix);
      } catch (error) {
        console.error("Error fetching global stiffness matrix:", error);
      }
    };

    fetchMatrix();
  }, []);

  return (
    <div className="transformation-matrix-section">
      <h2 className="form-title">Assembled Global Stiffness Matrix [K]</h2>
      <div className="matrix-scroll-container">
        <table className="matrix-table">
          <thead>
            <tr>
              <th></th>
              {matrix[0]?.map((_, colIndex) => (
                <th key={colIndex}>DOF {colIndex + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <th>DOF {rowIndex + 1}</th>
                {row.map((val, colIndex) => (
                  <td key={colIndex}>{val.toFixed(2)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AssembledMatrix;
