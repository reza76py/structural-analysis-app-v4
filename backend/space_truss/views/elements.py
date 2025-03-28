from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Elements
from ..calculations.element_length import calculate_element_length
from ..calculations.direction_cosines import calculate_direction_cosines
from ..calculations.transformation_matrix import build_transformation_matrix
from ..serializers import ElementsSerializer
from ..calculations.local_stiffness_matrix import calculate_local_stiffness_matrix
from ..calculations.global_stiffness_matrix import assemble_global_stiffness_matrix
from ..calculations.generate_dof_indices import generate_dof_indices

import numpy as np

class ElementView(APIView):

    def get(self, request):
        elements = Elements.objects.all()
        serializer = ElementsSerializer(elements, many=True)
        return Response({"elements": serializer.data}, status=status.HTTP_200_OK)


    def post(self, request):
        start_node_str = request.data.get("startNode")
        end_node_str = request.data.get("endNode")
        area = request.data.get("area", 1.0)
        youngs_modulus = request.data.get("youngs_modulus", 1.0)

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
            length=length,
            area=area,
            youngs_modulus=youngs_modulus
        )

        return Response({
            "message": "Element saved successfully",
            "startNode": start_node_str,
            "endNode": end_node_str,
            "length": length,
            "area": area,
            "youngs_modulus": youngs_modulus,
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
    

class ElementLocalStiffnessMatrixView(APIView):
    def get(self, request):
        elements = Elements.objects.all().values("id", "startNode", "endNode", "length", "area", "youngs_modulus")
        results = []

        for element in elements:
            try:
                k_local = calculate_local_stiffness_matrix(
                    area=float(element["area"]),
                    E=float(element["youngs_modulus"]),
                    L=float(element["length"])
                )

                results.append({
                    "id": element["id"],
                    "startNode": element["startNode"],
                    "endNode": element["endNode"],
                    "k_local": k_local.tolist()
                })
            except Exception as e:
                results.append({
                    "id": element["id"],
                    "error": str(e)
                })

        return Response({"local_stiffness_matrices": results}, status=status.HTTP_200_OK)
    



class ElementGlobalStiffnessMatrixView(APIView):
    def get(self, request):
        elements_qs = Elements.objects.all()
        elements = []

        # Build list of element dictionaries with necessary info
        for element in elements_qs:
            elements.append({
                "startNode": element.startNode,
                "endNode": element.endNode,
                "area": element.area,
                "youngs_modulus": element.youngs_modulus,
                "length": element.length,
                "dof_indices": generate_dof_indices(element.startNode, element.endNode),
            })

        total_dofs = len(set(idx for el in elements for idx in el["dof_indices"]))
        S = assemble_global_stiffness_matrix(elements, total_dofs)
        
        return Response({
            "global_stiffness_matrix": S.tolist()
        }, status=status.HTTP_200_OK)    
