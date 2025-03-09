from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Node
from .serializers import NodeSerializer

class NodeView(APIView):
    def post(self, request):
        nodes_data = request.data.get("nodes", [])  # Extract nodes list from request

        if not nodes_data:
            return Response({"error": "No nodes provided"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = NodeSerializer(data=nodes_data, many=True)  # Handle multiple nodes

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

    def delete(self, request):
        Node.objects.all().delete()  # Delete all nodes from MySQL
        return Response({"message": "All nodes deleted successfully"}, status=status.HTTP_204_NO_CONTENT)