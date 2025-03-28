import numpy as np
from numpy.typing import NDArray

from .transformation_matrix import build_transformation_matrix
from .direction_cosines import calculate_direction_cosines
from .local_stiffness_matrix import calculate_local_stiffness_matrix

def assemble_global_stiffness_matrix(elements: list, total_dofs: int) -> NDArray[np.float64]:
    """
    Assembles the global stiffness matrix S (size total_dofs x total_dofs)
    by summing transformed element stiffness matrices.

    Parameters:
    - elements: list of dicts with keys:
        - startNode (e.g., "0,0,0")
        - endNode   (e.g., "6,0,8")
        - area
        - youngs_modulus
        - length
        - dof_indices: list of 6 global DOF indices [a,b,c,d,e,f]
    - total_dofs: total number of degrees of freedom (e.g., 18)

    Returns:
    - S: Global stiffness matrix (total_dofs x total_dofs)
    """
    S = np.zeros((total_dofs, total_dofs))

    for element in elements:
        A = float(element["area"])
        E = float(element["youngs_modulus"])
        L = float(element["length"])

        # 1. Direction Cosines
        cos = calculate_direction_cosines(element["startNode"], element["endNode"])
        T = build_transformation_matrix(cos["cos_x"], cos["cos_y"], cos["cos_z"])

        # 2. Local Stiffness Matrix (2x2)
        k_local = calculate_local_stiffness_matrix(A, E, L)

        # 3. Global Stiffness Matrix for the element (6x6)
        T = np.array(T).reshape(2, 6)         # Ensure shape is correct
        k_global = T.T @ k_local @ T          # Matrix multiplication

        # 4. Add to Global Matrix
        dof_indices = element["dof_indices"]
        for i in range(6):
            for j in range(6):
                S[dof_indices[i]][dof_indices[j]] += k_global[i][j]

    return S
