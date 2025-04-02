import { FC, useEffect, useState } from "react";
import axios from "axios";

type AxialForce = {
  element_id: number;
  startNode: string;
  endNode: string;
  force: number;
};

const InternalAxialForces: FC = () => {
  const [forces, setForces] = useState<AxialForce[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchForces = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/internal-axial-forces/");
        setForces(response.data.internal_axial_forces);
      } catch (err: any) {
        setError("❌ Failed to fetch internal forces.");
        console.error(err);
      }
    };

    fetchForces();
  }, []);

  return (
    <div className="internal-force-section">
      <h2 className="form-title">Internal Axial Forces (per Element)</h2>

      {error && <p className="error-text">{error}</p>}

      {forces.length > 0 && (
        <table className="matrix-table">
          <thead>
            <tr>
              <th>Element ID</th>
              <th>Start Node</th>
              <th>End Node</th>
              <th>Force (N)</th>
            </tr>
          </thead>
          <tbody>
            {forces.map((el) => (
              <tr key={el.element_id}>
                <td>{el.element_id}</td>
                <td>{el.startNode}</td>
                <td>{el.endNode}</td>
                <td>{el.force.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default InternalAxialForces;

