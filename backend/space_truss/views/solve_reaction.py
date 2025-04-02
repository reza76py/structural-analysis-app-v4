from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import numpy as np

from ..calculations.assemble_global_matrix import assemble_global_stiffness_matrix
from ..calculations.generate_load_vector import generate_load_vector
from ..calculations.apply_boundary_conditions import get_restrained_dofs, apply_boundary_conditions
from ..calculations.solve_displacement import solve_displacement
from ..calculations.solve_reactions import solve_reactions
from ..models import Node

class SolveReactionView(APIView):
    def get(self, request):
        try:
            # Step 1: Assemble K
            from ..models import Elements
            elements = Elements.objects.all().values("startNode", "endNode", "area", "youngs_modulus", "length")
            K = assemble_global_stiffness_matrix(list(elements))

            # Step 2: Generate P
            nodes = Node.objects.all()
            ordered_coords = [f"{n.x},{n.y},{n.z}" for n in nodes]
            total_dofs = 3 * len(ordered_coords)
            P = generate_load_vector(total_dofs, ordered_coords)

            # Step 3: Apply boundary conditions
            restrained_dofs = get_restrained_dofs()
            K_mod, P_mod = apply_boundary_conditions(K, P, restrained_dofs)

            # Step 4: Solve for displacements
            d = solve_displacement(K_mod, P_mod)

            # Step 5: Solve for reactions
            reactions = solve_reactions(displacement_vector=d)

            return Response({"reaction_forces": reactions}, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
