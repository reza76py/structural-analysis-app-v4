from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import Load
from ..serializers import LoadSerializer

class LoadView(APIView):

    def get(self, request):
        """Retrieve all loads"""
        loads = Load.objects.all()
        serializer = LoadSerializer(loads, many=True)
        return Response(serializer.data)

    def post(self, request):
        """Save a new load"""
        node_coordinate = request.data.get("node_coordinate")
        Fx = request.data.get("Fx", 0.0)
        Fy = request.data.get("Fy", 0.0)
        Fz = request.data.get("Fz", 0.0)

        if not node_coordinate:
            return Response({"error": "Node coordinate is required."}, status=status.HTTP_400_BAD_REQUEST)

        load_data = {
            "node_coordinate": node_coordinate,
            "Fx": Fx,
            "Fy": Fy,
            "Fz": Fz,
        }

        serializer = LoadSerializer(data=load_data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request):
        """Delete all loads"""
        Load.objects.all().delete()
        return Response({"message": "All loads deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
