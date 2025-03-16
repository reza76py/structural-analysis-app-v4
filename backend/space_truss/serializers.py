from rest_framework import serializers
from .models import Node, Support

class NodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = '__all__'



class SupportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Support
        fields = ["id", "node_coordinate", "type", "x_restrained", "y_restrained", "z_restrained"]