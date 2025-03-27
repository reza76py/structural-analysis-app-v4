from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Elements
from ..calculations.element_length import calculate_element_length
from ..calculations.direction_cosines import calculate_direction_cosines
from ..calculations.transformation_matrix import build_transformation_matrix

class ElementView(APIView):

    def get(self, request):
        elements = Elements.objects.all().values("id", "startNode", "endNode", "length")
        return Response({"elements": list(elements)}, status=status.HTTP_200_OK)

    def post(self, request):
        start_node_str = request.data.get("startNode")
        end_node_str = request.data.get("endNode")

        if not start_node_str or not end_node_str:
            return Response({"error": "Both startNode and endNode are required."}, status=status.HTTP_400_BAD_REQUEST)

        # ✅ Convert "1.0,2.0,3.0" → (1.0, 2.0, 3.0)
        start_node = tuple(map(float, start_node_str.split(",")))
        end_node = tuple(map(float, end_node_str.split(",")))

        # ✅ Calculate the element length
        length = calculate_element_length(start_node, end_node)

        # ✅ Save element in MySQL
        element = Elements.objects.create(
            startNode=start_node_str,
            endNode=end_node_str,
            length=length
        )

        return Response({
            "message": "Element saved successfully",
            "startNode": start_node_str,
            "endNode": end_node_str,
            "length": length
        }, status=status.HTTP_201_CREATED)

    def delete(self, request):
        Elements.objects.all().delete()  # ✅ Delete all elements
        return Response({"message": "All elements deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class ElementDirectionCosinesView(APIView):

    def get(self, request):
        elements = Elements.objects.all().values("id", "startNode", "endNode")
        results = []

        for element in elements:
            direction_cosines = calculate_direction_cosines(
                element["startNode"], element["endNode"]
            )
            results.append({
                "id": element["id"],
                "startNode": element["startNode"],
                "endNode": element["endNode"],
                **direction_cosines
            })

        return Response({"direction_cosines": results}, status=status.HTTP_200_OK)
    


class ElementTransformationMatrixView(APIView):

    def get(self, request):
        elements = Elements.objects.all().values("id", "startNode", "endNode")
        results = []

        for element in elements:
            # Get direction cosines from the previous function
            from ..calculations.direction_cosines import calculate_direction_cosines
            cosines = calculate_direction_cosines(
                element["startNode"], element["endNode"]
            )

            if "error" in cosines:
                continue

            T = build_transformation_matrix(
                cos_x=cosines["cos_x"],
                cos_y=cosines["cos_y"],
                cos_z=cosines["cos_z"]
            )

            results.append({
                "id": element["id"],
                "startNode": element["startNode"],
                "endNode": element["endNode"],
                "T_matrix": T
            })

        return Response({"transformation_matrices": results}, status=status.HTTP_200_OK)
