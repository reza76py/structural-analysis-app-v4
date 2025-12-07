from rest_framework.views import APIView
from rest_framework.response import Response

class FileInputHomeView(APIView):
    def get(self, request):
        return Response({
            "message": "File Input Module",
            "endpoints": {
                "upload_pdf": "/file/upload/pdf/",
                "upload_excel": "/file/upload/excel/"
            }
        })
