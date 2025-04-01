import numpy as np
from ..models import Node
from .global_stiffness_matrix import compute_element_global_stiffness
from .generate_dof_indices import generate_dof_indices


def assemble_global_stiffness_matrix(elements: list[dict]) -> np.ndarray:
    """
    Assemble the global stiffness matrix [K] from element-wise global matrices.

    Parameters:
    - elements: list of dictionaries, each containing:
        - startNode (str)
        - endNode (str)
        - area (float)
        - youngs_modulus (float)
        - length (float)

    Returns:
    - K_global: (n_dof x n_dof) global stiffness matrix
    """
    # ✅ Step 1: Get total DOFs from database
    num_nodes = Node.objects.count()
    total_dofs = 3 * num_nodes

    # ✅ Step 2: Initialize global K
    K_global = np.zeros((total_dofs, total_dofs))

    # ✅ Step 3: Loop through elements and assemble
    for el in elements:
        dof_indices = generate_dof_indices(el["startNode"], el["endNode"])  # list of 6 DOFs

        k_e = compute_element_global_stiffness(
            startNode=el["startNode"],
            endNode=el["endNode"],
            area=float(el["area"]),
            youngs_modulus=float(el["youngs_modulus"]),
            length=float(el["length"]),
        )

        for i in range(6):
            for j in range(6):
                global_i = dof_indices[i]
                global_j = dof_indices[j]
                K_global[global_i, global_j] += k_e[i, j]  # ✅ Add values

    return K_global
