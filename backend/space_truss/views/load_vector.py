from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..models import Node
from ..calculations.generate_load_vector import generate_load_vector

class LoadVectorView(APIView):
    def get(self, request):
        # ✅ Step 1: Get all nodes from Node table in DB order
        nodes_qs = Node.objects.all()
        ordered_node_coords = [f"{n.x},{n.y},{n.z}" for n in nodes_qs]

        # ✅ Step 2: Total DOFs
        total_dof = 3 * len(ordered_node_coords)

        # ✅ Step 3: Generate load vector
        P = generate_load_vector(total_dof, ordered_node_coords)

        # ✅ Step 4: Make response detailed (DOF, node, direction)
        directions = ["Fx", "Fy", "Fz"]
        load_vector = []

        for i, coord in enumerate(ordered_node_coords):
            for j, dir in enumerate(directions):
                dof = 3 * i + j  # zero-based
                load_vector.append({
                    "dof": dof + 1,  # shift to 1-based
                    "node": coord,
                    "direction": dir,
                    "P_value": P[dof][0]
                })

        return Response({"load_vector": load_vector}, status=status.HTTP_200_OK)
