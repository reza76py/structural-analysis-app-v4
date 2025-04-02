from ..models import Support, Node
import numpy as np
from typing import Tuple


def get_restrained_dofs() -> list[int]:
    """
    Reads all supports from the database and returns a list of restrained DOF indices.
    Each node has 3 DOFs: [x, y, z] mapped as:
        DOF = [3*i, 3*i+1, 3*i+2] for node index i
    The order is based on Node.objects.all().
    """
    # Step 1: Normalize node coordinates as keys
    def normalize(coord_str: str) -> str:
        parts = coord_str.split(",")
        return ",".join([str(float(p)) for p in parts])

    # Step 2: Get nodes in DB order and build map: "x,y,z" → index
    all_nodes = Node.objects.all()
    ordered_coords = [normalize(f"{n.x},{n.y},{n.z}") for n in all_nodes]
    node_to_index = {coord: i for i, coord in enumerate(ordered_coords)}

    # Step 3: Collect restrained DOFs from Support table
    restrained_dofs = []
    supports = Support.objects.all()

    for s in supports:
        norm_coord = normalize(s.node_coordinate)
        if norm_coord not in node_to_index:
            continue  # Skip if node not found

        idx = node_to_index[norm_coord]
        if s.x_restrained:
            restrained_dofs.append(3 * idx + 0)
        if s.y_restrained:
            restrained_dofs.append(3 * idx + 1)
        if s.z_restrained:
            restrained_dofs.append(3 * idx + 2)

    return sorted(restrained_dofs)


def apply_boundary_conditions(K: np.ndarray, P: np.ndarray, restrained_dofs: list[int]) -> Tuple[np.ndarray, np.ndarray]:
    """
    Modify [K] and [P] to apply boundary conditions.

    Parameters:
    - K: Global stiffness matrix (n x n)
    - P: Load vector (n x 1)
    - restrained_dofs: list of restrained DOF indices (zero-based)

    Returns:
    - Modified (K, P) as a tuple
    """

    K_mod = K.copy()
    P_mod = P.copy()

    for dof in restrained_dofs:
        K_mod[dof, :] = 0
        K_mod[:, dof] = 0
        K_mod[dof, dof] = 1  # set diagonal to 1
        P_mod[dof, 0] = 0    # set load value to 0

    return K_mod, P_mod