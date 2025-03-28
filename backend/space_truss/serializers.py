from rest_framework import serializers
from .models import Node, Support, Load, Elements

class NodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Node
        fields = '__all__'



class SupportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Support
        fields = ["id", "node_coordinate", "x_restrained", "y_restrained", "z_restrained"]


class LoadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Load
        fields = ["id", "node_coordinate", "Fx", "Fy", "Fz"]


class ElementsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Elements
        fields = ['id', 'startNode', 'endNode', 'length', 'area', 'youngs_modulus']