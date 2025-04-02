import numpy as np
from typing import Tuple

def solve_displacement(K: np.ndarray, P: np.ndarray) -> np.ndarray:
    """
    Solves the system [K]{d} = {P} for displacements.

    Parameters:
    - K: Modified global stiffness matrix (n x n)
    - P: Modified load vector (n x 1)

    Returns:
    - Displacement vector (n x 1)
    """
    try:
        d = np.linalg.solve(K, P)
        return d
    except np.linalg.LinAlgError as e:
        raise ValueError(f"Error solving [K]d = P: {str(e)}")
