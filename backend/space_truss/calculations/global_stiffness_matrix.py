import numpy as np
from numpy.typing import NDArray

from .direction_cosines import calculate_direction_cosines
from .transformation_matrix import build_transformation_matrix
from .local_stiffness_matrix import calculate_local_stiffness_matrix

def compute_element_global_stiffness(startNode: str, endNode: str, area: float, youngs_modulus: float, length: float) -> NDArray:
    """
    Computes the 6x6 global stiffness matrix for a single element.

    Parameters:
    - startNode, endNode: string coordinates "x,y,z"
    - area: cross-sectional area A
    - youngs_modulus: Young's modulus E
    - length: element length L

    Returns:
    - k_global: 6x6 global stiffness matrix (as numpy array)
    """
    # 1. Direction cosines
    cos = calculate_direction_cosines(startNode, endNode)

    # 2. Transformation matrix T (2x6)
    T = np.array(build_transformation_matrix(cos["cos_x"], cos["cos_y"], cos["cos_z"])).reshape(2, 6)

    # 3. Local stiffness matrix k (2x2)
    k_local = calculate_local_stiffness_matrix(area, youngs_modulus, length)

    # 4. Global stiffness matrix k_global = Tᵀ·k·T
    k_global = T.T @ k_local @ T

    return k_global
