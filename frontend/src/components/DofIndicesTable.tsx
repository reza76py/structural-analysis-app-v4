import { FC, useEffect, useState } from "react";
import axios from "axios";

type ElementDOF = {
  id: number;
  startNode: string;
  endNode: string;
  dof_indices: number[];
};

type DOFRow = {
  dof: number;
  node: string;
  direction: string;
  P_value: number;
};

const directions = ["Fx", "Fy", "Fz"];

const DofIndicesTable: FC = () => {
  const [rows, setRows] = useState<DOFRow[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dofRes, loadRes] = await Promise.all([
          axios.get("http://127.0.0.1:8000/api/dof-indices/"),
          axios.get("http://127.0.0.1:8000/api/load-vector/")
        ]);

        const dofData: ElementDOF[] = dofRes.data.dof_indices;
        const loadVector: Record<number, number> = {};

        loadRes.data.load_vector.forEach((entry: any) => {
          loadVector[entry.dof] = entry.P_value;
        });

        const dofMap: Record<number, DOFRow> = {};

        dofData.forEach(({ startNode, endNode, dof_indices }) => {
          const nodes = [startNode, endNode];
          dof_indices.forEach((dofIndex, i) => {
            const dof = dofIndex + 1;
            if (!dofMap[dof]) {
              const node = nodes[Math.floor(i / 3)];
              const direction = directions[i % 3];
              dofMap[dof] = {
                dof,
                node,
                direction,
                P_value: loadVector[dof] || 0,
              };
            }
          });
        });

        const dofRows = Object.values(dofMap).sort((a, b) => a.dof - b.dof);
        setRows(dofRows);
      } catch (error) {
        console.error("❌ Error fetching DOF or Load data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="transformation-matrix-section">
      <h2 className="form-title">Degree of Freedom (DOF) Table</h2>
      <table className="matrix-table">
        <thead>
          <tr>
            <th>DOF</th>
            <th>Node</th>
            <th>Direction</th>
            <th>P</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ dof, node, direction, P_value }) => (
            <tr key={dof}>
              <td>{dof}</td>
              <td>{node}</td>
              <td>{direction}</td>
              <td>{P_value.toFixed(3)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DofIndicesTable;
