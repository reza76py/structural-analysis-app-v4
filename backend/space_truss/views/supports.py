from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Support
from ..serializers import SupportSerializer

class SupportView(APIView):

    def get(self, request):
        supports = Support.objects.all()
        serializer = SupportSerializer(supports, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Save a new support with x, y, and z constraints"""
        node_coordinate = request.data.get("node_coordinate")
        x_restrained = request.data.get("x_restrained", False)
        y_restrained = request.data.get("y_restrained", False)
        z_restrained = request.data.get("z_restrained", False)

        # Validate input
        if not node_coordinate:
            return Response({"error": "Node coordinate is required."}, status=status.HTTP_400_BAD_REQUEST)

        support_data = {
            "node_coordinate": node_coordinate,
            "x_restrained": x_restrained,
            "y_restrained": y_restrained,
            "z_restrained": z_restrained,
        }

        serializer = SupportSerializer(data=support_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request):
        Support.objects.all().delete()
        return Response({"message": "All supports deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
