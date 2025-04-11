from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import UploadedFileSerializer
from ..file_processors.excel_processor import extract_coordinates_from_excel
from space_truss.models import Node, Elements, Support, Load, AssembledGlobalStiffnessMatrix


class ExcelUploadView(APIView):
    def post(self, request, format=None):
        serializer = UploadedFileSerializer(data=request.data)

        if serializer.is_valid():
            uploaded_file = serializer.validated_data['file']

            print("📥 File received:", uploaded_file.name)

            try:
                print("🔍 Content type:", uploaded_file.content_type)
                uploaded_file.seek(0)

                # 1. Extract coordinates from Excel
                extracted_nodes = extract_coordinates_from_excel(uploaded_file)

                # 2. Clear old data from space_truss
                Node.objects.all().delete()
                Elements.objects.all().delete()
                Support.objects.all().delete()
                Load.objects.all().delete()
                AssembledGlobalStiffnessMatrix.objects.all().delete()

                # 3. Save new node data
                for node in extracted_nodes:
                    Node.objects.create(
                        x=node['x'],
                        y=node['y'],
                        z=node['z']
                    )

                return Response({
                    "status": "success",
                    "message": f"{len(extracted_nodes)} nodes extracted and saved.",
                    "extracted_nodes": extracted_nodes
                }, status=status.HTTP_201_CREATED)

            except Exception as e:
                return Response({
                    "status": "error",
                    "message": str(e)
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
