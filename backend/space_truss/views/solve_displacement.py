from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

import numpy as np

from ..models import AssembledGlobalStiffnessMatrix, Node
from ..calculations.generate_load_vector import generate_load_vector
from ..calculations.apply_boundary_conditions import get_restrained_dofs, apply_boundary_conditions
from ..calculations.solve_displacement import solve_displacement


class SolveDisplacementView(APIView):
    def get(self, request):
        try:
            # ✅ Load latest [K] from DB
            matrix_obj = AssembledGlobalStiffnessMatrix.objects.latest("created_at")
            K_global = np.array(matrix_obj.data)

            # ✅ Load vector P (based on node order)
            nodes_qs = Node.objects.all()
            ordered_coords = [f"{n.x},{n.y},{n.z}" for n in nodes_qs]
            total_dof = 3 * len(ordered_coords)
            P = generate_load_vector(total_dof, ordered_coords)

            # ✅ Apply boundary conditions
            restrained_dofs = get_restrained_dofs()
            K_mod, P_mod = apply_boundary_conditions(K_global, P, restrained_dofs)

            # ✅ Solve [K]{d} = {P}
            d = solve_displacement(K_mod, P_mod)

            # ✅ Return as JSON
            displacement_vector = [{"dof": i+1, "value": round(float(val), 6)} for i, val in enumerate(d)]

            return Response({"displacement_vector": displacement_vector}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
