# file_input/views/pdf_upload_view.py

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..serializers import UploadedFileSerializer
from ..file_processors import pdf_processor
from space_truss.models import Node, Elements, Support, Load, AssembledGlobalStiffnessMatrix
from ..file_processors.pdf_processor import extract_coordinates_from_pdf



class PDFUploadView(APIView):
    def post(self, request, format=None):
        serializer = UploadedFileSerializer(data=request.data)

        if serializer.is_valid():
            uploaded_file = serializer.validated_data['file']

            try:
                # 1. Extract coordinates from PDF
                extracted_nodes = pdf_processor.extract_coordinates_from_pdf(uploaded_file)

                # 2. Clear old node data from space_truss
                Node.objects.all().delete()
                Elements.objects.all().delete()
                Support.objects.all().delete()
                Load.objects.all().delete()
                AssembledGlobalStiffnessMatrix.objects.all().delete()

                # 3. Save each new node
                for node in extracted_nodes:
                    Node.objects.create(
                        coordinate=f"{node['x']},{node['y']},{node['z']}"
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
