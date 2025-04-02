import numpy as np
from ..models import AssembledGlobalStiffnessMatrix, Node
from .generate_load_vector import generate_load_vector
from .apply_boundary_conditions import get_restrained_dofs
from django.core.exceptions import ObjectDoesNotExist


def solve_reactions(displacement_vector: np.ndarray) -> list[dict]:
    """
    Solve reactions using the equation: R = K * d - P
    Only return reactions at restrained DOFs.
    """
    try:
        # ✅ Step 1: Load original K
        matrix_obj = AssembledGlobalStiffnessMatrix.objects.latest("created_at")
        K = np.array(matrix_obj.data)

        # ✅ Step 2: Determine total DOFs
        num_nodes = Node.objects.count()
        total_dof = 3 * num_nodes

        # ✅ Step 3: Generate global load vector P
        node_coords = [f"{n.x},{n.y},{n.z}" for n in Node.objects.all()]
        P = generate_load_vector(total_dof, node_coords)

        # ✅ Step 4: Compute reactions: R = K @ d - P
        R = K @ displacement_vector - P

        # ✅ Step 5: Extract only restrained DOFs
        restrained_dofs = get_restrained_dofs()
        reactions = []

        for dof in restrained_dofs:
            reactions.append({
                "dof": dof + 1,  # 1-based indexing for display
                "reaction": round(R[dof, 0], 6)
            })

        return reactions

    except ObjectDoesNotExist:
        return [{"error": "No global stiffness matrix found in database."}]
    except Exception as e:
        return [{"error": str(e)}]
