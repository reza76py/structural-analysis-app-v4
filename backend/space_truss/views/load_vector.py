# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status

# from ..models import Elements, Load  # Import Load if missing
# from ..calculations.generate_load_vector import generate_load_vector
# from ..calculations.generate_dof_indices import generate_dof_indices

# class LoadVectorView(APIView):
#     def get(self, request):
#         # Step 1: Extract all unique node coordinates from Elements
#         node_coords = set()
#         for el in Elements.objects.all():
#             node_coords.add(el.startNode.strip())
#             node_coords.add(el.endNode.strip())

#         # Step 2: Sort nodes lexicographically (X, Y, Z)
#         sorted_nodes = sorted(node_coords, key=lambda s: list(map(float, s.split(","))))
        
#         # Step 3: Create a node_map based on sorted order
#         node_map = {coord: idx for idx, coord in enumerate(sorted_nodes)}
        
#         # Step 4: Assign this node_map to generate_dof_indices to ensure consistency
#         generate_dof_indices.node_map = node_map  # Override static mapping

#         # Step 5: Total DOFs = 3 * number of nodes
#         total_dof = 3 * len(sorted_nodes)

#         # Step 6: Generate load vector using sorted_nodes
#         load_vector = generate_load_vector(total_dof, sorted_nodes)

#         return Response({
#             "load_vector": load_vector.flatten().tolist()
#         }, status=status.HTTP_200_OK)







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
