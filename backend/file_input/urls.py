from django.urls import path
from .views.pdf_upload_view import PDFUploadView

urlpatterns = [
    path('upload/pdf/', PDFUploadView.as_view(), name='upload-pdf'),
]
