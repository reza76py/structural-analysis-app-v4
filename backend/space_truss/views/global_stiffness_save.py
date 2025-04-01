from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..models import AssembledGlobalStiffnessMatrix
from ..calculations.assemble_global_matrix import assemble_global_stiffness_matrix


class SaveAssembledGlobalStiffnessView(APIView):

    def post(self, request):
        try:
            K = assemble_global_stiffness_matrix()
            AssembledGlobalStiffnessMatrix.objects.all().delete()
            AssembledGlobalStiffnessMatrix.objects.create(data=K.tolist())
            return Response({"message": "Global stiffness matrix assembled and saved."}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def get(self, request):
        try:
            matrix_obj = AssembledGlobalStiffnessMatrix.objects.latest("created_at")
            return Response({"matrix": matrix_obj.data}, status=status.HTTP_200_OK)
        except AssembledGlobalStiffnessMatrix.DoesNotExist:
            return Response({"error": "No assembled matrix found."}, status=status.HTTP_404_NOT_FOUND)
