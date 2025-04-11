from rest_framework import serializers

class UploadedFileSerializer(serializers.Serializer):
    file = serializers.FileField()
