from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import numpy as np

from ..models import Elements, Node
from ..calculations.assemble_global_matrix import assemble_global_stiffness_matrix
from ..calculations.generate_load_vector import generate_load_vector
from ..calculations.apply_boundary_conditions import get_restrained_dofs, apply_boundary_conditions
from ..calculations.solve_displacement import solve_displacement
from ..calculations.internal_forces import compute_internal_axial_forces

class InternalAxialForceView(APIView):
    def get(self, request):
        try:
            # ✅ Step 1: Load element and node data
            elements_qs = Elements.objects.all().values("startNode", "endNode", "area", "youngs_modulus", "length")
            elements = list(elements_qs)

            # ✅ Step 2: Assemble global stiffness matrix
            K = assemble_global_stiffness_matrix(elements)

            # ✅ Step 3: Load global DOF order
            nodes = Node.objects.all()
            ordered_coords = [f"{n.x},{n.y},{n.z}" for n in nodes]
            total_dofs = 3 * len(ordered_coords)

            # ✅ Step 4: Build load vector P
            P = generate_load_vector(total_dofs, ordered_coords)

            # ✅ Step 5: Apply boundary conditions
            restrained_dofs = get_restrained_dofs()
            K_mod, P_mod = apply_boundary_conditions(K, P, restrained_dofs)

            # ✅ Step 6: Solve for displacements
            d = solve_displacement(K_mod, P_mod)

            # ✅ Step 7: Compute axial forces
            axial_forces = compute_internal_axial_forces(elements, d, ordered_coords)

            return Response({"internal_axial_forces": axial_forces}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
