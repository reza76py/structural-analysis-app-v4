import { FC, useState } from "react";
import axios from "axios";

type Displacement = {
    dof: number;
    value: number;
};

const SolveDisplacement: FC = () => {
    const [displacements, setDisplacements] = useState<Displacement[] | null>(
        null,
    );
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchDisplacement = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/solve-displacement/",
            );
            setDisplacements(response.data.displacement_vector);
        } catch (err: any) {
            setError("❌ Error solving displacements.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="displacement-container">
            <h2 className="form-title">Solve Displacement Vector [d]</h2>
            <button
                onClick={fetchDisplacement}
                disabled={loading}
                className="solve-btn"
            >
                {loading ? "Solving..." : "Solve Displacements"}
            </button>

            {error && <p className="error-text">{error}</p>}

            {displacements && (
                <div className="matrix-display">
                    <h3>Displacement Vector [d]:</h3>
                    <table className="matrix-table">
                        <thead>
                            <tr>
                                <th>DOF</th>
                                <th>d (Displacement)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displacements.map((d) => (
                                <tr key={d.dof}>
                                    <td>{d.dof}</td>
                                    <td>{d.value.toFixed(6)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SolveDisplacement;
