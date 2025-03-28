import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/styles_elementsForm.css"; // or create a new CSS if preferred

const GlobalStiffnessMatrix = () => {
  const [matrix, setMatrix] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatrix = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/elements/global-stiffness/");
        setMatrix(response.data.global_stiffness_matrix);
      } catch (error) {
        console.error("Error fetching global stiffness matrix:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatrix();
  }, []);

  return (
    <div className="global-matrix-container">
      <h2 className="form-title">Global Stiffness Matrix [S]</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="matrix-scroll">
          <table className="matrix-table">
            <tbody>
              {matrix.map((row, i) => (
                <tr key={i}>
                  {row.map((value, j) => (
                    <td key={j}>{value.toFixed(2)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GlobalStiffnessMatrix;
