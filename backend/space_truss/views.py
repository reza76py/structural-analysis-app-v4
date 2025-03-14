from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Node, Elements
from .serializers import NodeSerializer
from .calculations.element_length import calculate_element_length

class NodeView(APIView):

    def get(self, request):
        nodes = Node.objects.all()
        serializer = NodeSerializer(nodes, many=True)
        return Response(serializer.data)

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
    

class ElementView(APIView):
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
            start_node=start_node_str,
            end_node=end_node_str,
            length=length
        )
        element.save()

        return Response({
            "message": "Element saved successfully",
            "startNode": start_node_str,
            "endNode": end_node_str,
            "length": length
        }, status=status.HTTP_201_CREATED)