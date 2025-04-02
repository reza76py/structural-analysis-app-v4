import { FC, useEffect, useState } from "react";
import axios from "axios";


const BoundaryConditionsResult: FC = () => {
  const [K, setK] = useState<number[][]>([]);
  const [P, setP] = useState<number[]>([]);
  const [restrainedDOFs, setRestrainedDOFs] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://127.0.0.1:8000/api/apply-boundary-conditions/");
        const { K_modified, P_modified, restrained_dofs } = res.data;

        setK(K_modified);
        setP(P_modified.flat()); // Convert 2D array to 1D
        setRestrainedDOFs(restrained_dofs);
      } catch (error) {
        console.error("Failed to fetch boundary condition results:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="matrix-section">
      <h2 className="form-title">Modified Global Stiffness Matrix [K]</h2>
      <table className="matrix-table">
        <tbody>
          {K.map((row, i) => (
            <tr key={i}>
              {row.map((value, j) => (
                <td key={j}>{value.toFixed(2)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="form-title">Modified Load Vector [P]</h2>
      <table className="matrix-table">
        <tbody>
          {P.map((val, i) => (
            <tr key={i}>
              <td>DOF {i + 1}</td>
              <td>{val.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 className="form-title">Restrained DOFs</h2>
      <p>{restrainedDOFs.join(", ")}</p>
    </div>
  );
};

export default BoundaryConditionsResult;
