from numpy.typing import NDArray
import numpy as np

def calculate_local_stiffness_matrix(area: float, E: float, L: float) -> NDArray:


    """
    Returns the 2x2 local stiffness matrix [k] for a truss element.
    k = (AE / L) * [[1, -1], [-1, 1]]
    """
    stiffness = (area * E) / L
    k_local = stiffness * np.array([[1, -1], [-1, 1]])
    return k_local
