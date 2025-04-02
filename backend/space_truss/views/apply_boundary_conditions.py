from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import numpy as np
from ..models import AssembledGlobalStiffnessMatrix, Node
from ..calculations.apply_boundary_conditions import get_restrained_dofs, apply_boundary_conditions
from ..calculations.generate_load_vector import generate_load_vector

class ApplyBoundaryConditionsView(APIView):
    def get(self, request):
        try:
            # ✅ Step 1: Load latest assembled [K] from DB
            matrix_obj = AssembledGlobalStiffnessMatrix.objects.latest("created_at")
            K = np.array(matrix_obj.data)

            # ✅ Step 2: Get node list and generate load vector [P]
            nodes_qs = Node.objects.all()
            ordered_node_coords = [f"{n.x},{n.y},{n.z}" for n in nodes_qs]
            total_dof = 3 * len(ordered_node_coords)
            P = generate_load_vector(total_dof, ordered_node_coords)

            # ✅ Step 3: Get restrained DOFs from supports
            restrained_dofs = get_restrained_dofs()

            # ✅ Step 4: Apply boundary conditions
            K_mod, P_mod = apply_boundary_conditions(K, P, restrained_dofs)

            # ✅ Step 5: Return as response
            return Response({
                "K_modified": K_mod.tolist(),
                "P_modified": P_mod.tolist(),
                "restrained_dofs": restrained_dofs
            }, status=status.HTTP_200_OK)

        except AssembledGlobalStiffnessMatrix.DoesNotExist:
            return Response({"error": "No assembled stiffness matrix found."}, status=status.HTTP_404_NOT_FOUND)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
