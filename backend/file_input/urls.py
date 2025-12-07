from django.urls import path
from .views.home_view import FileInputHomeView
from .views.pdf_upload_view import PDFUploadView
from .views.excel_upload_view import ExcelUploadView


urlpatterns = [
    path('', FileInputHomeView.as_view(), name='file-input-home'),
    path('upload/pdf/', PDFUploadView.as_view(), name='upload-pdf'),
    path('upload/excel/', ExcelUploadView.as_view(), name='upload-excel'),
]
