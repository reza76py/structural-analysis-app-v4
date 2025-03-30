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
};

const directions = ["Fx", "Fy", "Fz"];

const DofIndicesTable: FC = () => {
  const [rows, setRows] = useState<DOFRow[]>([]);

  useEffect(() => {
    const fetchDofIndices = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/dof-indices/");
        const data: ElementDOF[] = response.data.dof_indices;

        const dofMap: Record<number, { node: string; direction: string }> = {};

        data.forEach(({ startNode, endNode, dof_indices }) => {
          const nodes = [startNode, endNode];
          dof_indices.forEach((dofIndex, i) => {
            if (!dofMap[dofIndex]) {
              const node = nodes[Math.floor(i / 3)];
              const direction = directions[i % 3];
              dofMap[dofIndex] = { node, direction };
            }
          });
        });

        const dofRows = Object.entries(dofMap)
          .sort(([a], [b]) => Number(a) - Number(b))
          .map(([index, { node, direction }]) => ({
            dof: Number(index) + 1,
            node,
            direction,
          }));

        setRows(dofRows);
      } catch (error) {
        console.error("Error fetching DOF indices:", error);
      }
    };

    fetchDofIndices();
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
          </tr>
        </thead>
        <tbody>
          {rows.map(({ dof, node, direction }) => (
            <tr key={dof}>
              <td>{dof}</td>
              <td>{node}</td>
              <td>{direction}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DofIndicesTable;
