from django.db import models

class UploadedFile(models.Model):
    FILE_TYPES = [
        ('pdf', 'PDF'),
        ('excel', 'Excel'),
        ('image', 'Image'),
        ('text', 'Text'),
        ('other', 'Other'),
    ]

    file = models.FileField(upload_to='uploads/')
    file_type = models.CharField(max_length=10, choices=FILE_TYPES)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.file.name} ({self.file_type})"
