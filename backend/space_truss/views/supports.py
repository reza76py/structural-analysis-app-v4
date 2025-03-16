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
        print("Received request data:", request.data)  # ✅ Debugging log

        node_coordinate = request.data.get("node_coordinate")
        support_type = request.data.get("type")

        if not node_coordinate or not support_type:
            print("❌ Missing required fields!")  # ✅ Debugging log
            return Response({"error": "Please provide node coordinate and support type"}, status=status.HTTP_400_BAD_REQUEST)
        
        print(f"✅ Support type received: {support_type}")

        restraints = {
            "Pinned": {"x_restrained": True, "y_restrained": True, "z_restrained": True},
            "Fixed": {"x_restrained": True, "y_restrained": True, "z_restrained": True},
            "Roller": {"x_restrained": False, "y_restrained": True, "z_restrained": False},
        }

        if support_type not in restraints:
            print("❌ Invalid support type:", support_type)  # ✅ Debugging log
            return Response({"error": "Invalid support type."}, status=status.HTTP_400_BAD_REQUEST)

        support_data = {
            "node_coordinate": node_coordinate,
            "type": support_type,
            **restraints[support_type],
        }

        serializer = SupportSerializer(data=support_data)

        if serializer.is_valid():
            serializer.save()
            print("✅ Support saved successfully:", support_data)  # ✅ Debugging log
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print("❌ Serializer errors:", serializer.errors)  # ✅ Debugging log
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


    def delete(self, request):
        Support.objects.all().delete()
        return Response({"message": "All supports deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
