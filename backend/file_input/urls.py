from django.urls import path
from .views.pdf_upload_view import PDFUploadView
from .views.excel_upload_view import ExcelUploadView


urlpatterns = [
    path('upload/pdf/', PDFUploadView.as_view(), name='upload-pdf'),
    path('upload/excel/', ExcelUploadView.as_view(), name='upload-excel'),
]
