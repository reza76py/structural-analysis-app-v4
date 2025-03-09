from django.db import models

class Node(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()

    def __str__(self):
        return f"Node({self.x}, {self.y}, {self.z})"
