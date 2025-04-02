import { FC, useState } from "react";
import axios from "axios";

const ReactionForces: FC = () => {
  const [reactions, setReactions] = useState<{ dof: number; reaction: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchReactions = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/solve-reaction/");
      setReactions(response.data.reaction_forces);
    } catch (err: any) {
      console.error(err);
      setError("❌ Failed to fetch reaction forces.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reaction-container">
      <h2 className="form-title">Reaction Forces</h2>
      <button onClick={fetchReactions} disabled={loading} className="solve-btn">
        {loading ? "Solving..." : "Solve Reaction Forces"}
      </button>

      {error && <p className="error-text">{error}</p>}

      {reactions.length > 0 && (
        <div className="matrix-display">
          <h3>Reaction Forces at Restrained DOFs:</h3>
          <table className="matrix-table">
            <thead>
              <tr>
                <th>DOF</th>
                <th>Reaction (N)</th>
              </tr>
            </thead>
            <tbody>
              {reactions.map(({ dof, reaction }) => (
                <tr key={dof}>
                  <td>{dof}</td>
                  <td>{reaction.toFixed(6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ReactionForces;
