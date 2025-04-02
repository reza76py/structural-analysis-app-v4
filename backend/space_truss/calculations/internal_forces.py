import numpy as np
from ..models import Node, Elements
from .generate_dof_indices import generate_dof_indices
from .direction_cosines import calculate_direction_cosines


def compute_internal_axial_forces(elements: list[dict], displacement_vector: np.ndarray, ordered_node_coords: list[str]) -> list[dict]:
    """
    Computes axial force in each element based on global displacement vector.

    Parameters:
    - displacement_vector: global displacement vector [d] (n x 1)

    Returns:
    - List of dicts: [ {"element_id": int, "force": float}, ... ]
    """
    forces = []
    elements = Elements.objects.all()

    for el in elements:
        dof_indices = generate_dof_indices(el.startNode, el.endNode)

        # Extract displacements corresponding to this element
        d_elem = displacement_vector[dof_indices].reshape((6, 1))

        # Get direction cosines
        cosines = calculate_direction_cosines(el.startNode, el.endNode)
        l, m, n = cosines["cos_x"], cosines["cos_y"], cosines["cos_z"]

        # Build transformation matrix T (2x6)
        T = np.array([
            [l, m, n, 0, 0, 0],
            [0, 0, 0, l, m, n],
        ])

        # Local displacement u_local = T · d_elem
        u_local = T @ d_elem

        # Axial force: F = (AE/L) * (u2 - u1)
        A = float(el.area)
        E = float(el.youngs_modulus)
        L = float(el.length)

        axial_force = (A * E / L) * (u_local[1, 0] - u_local[0, 0])

        forces.append({
            "element_id": el.id,
            "startNode": el.startNode,
            "endNode": el.endNode,
            "force": round(axial_force, 3)
        })

    return forces
