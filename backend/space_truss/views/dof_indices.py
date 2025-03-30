from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status

from ..models import Elements
from ..calculations.generate_dof_indices import generate_dof_indices

class ElementDOFIndicesView(APIView):
    def get(self, request):
        elements = Elements.objects.all().values("id", "startNode", "endNode")
        results = []

        for el in elements:
            dof = generate_dof_indices(el["startNode"], el["endNode"])
            results.append({
                "id": el["id"],
                "startNode": el["startNode"],
                "endNode": el["endNode"],
                "dof_indices": dof
            })

        return Response({"dof_indices": results}, status=status.HTTP_200_OK)
