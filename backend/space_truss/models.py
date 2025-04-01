from django.db import models

class Node(models.Model):
    x = models.FloatField()
    y = models.FloatField()
    z = models.FloatField()

    def __str__(self):
        return f"Node({self.x}, {self.y}, {self.z})"

class Elements(models.Model):
    startNode = models.CharField(max_length=50)
    endNode = models.CharField(max_length=50)
    length = models.FloatField()
    area = models.FloatField(default=1.0)
    youngs_modulus = models.FloatField(default=1.0)


    def __str__(self):
        return f"Element from {self.startNode} to {self.endNode} (Length: {self.length})"
    


class Support(models.Model):
    node_coordinate = models.CharField(max_length=50, unique=True)  # Store as "x,y,z"
    x_restrained = models.BooleanField(default=False)
    y_restrained = models.BooleanField(default=False)
    z_restrained = models.BooleanField(default=False)

    def __str__(self):
        return f"Support at {self.node_coordinate} (x: {self.x_restrained}, y: {self.y_restrained}, z: {self.z_restrained})"


class Load(models.Model):
    node_coordinate = models.CharField(max_length=50, unique=True)  # Store as "x,y,z"
    Fx = models.FloatField(default=0.0)
    Fy = models.FloatField(default=0.0)
    Fz = models.FloatField(default=0.0)

    def __str__(self):
        return f"Load at {self.node_coordinate} (Fx: {self.Fx}, Fy: {self.Fy}, Fz: {self.Fz})"


class AssembledGlobalStiffnessMatrix(models.Model):
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Assembled Global Stiffness Matrix @ {self.created_at}"