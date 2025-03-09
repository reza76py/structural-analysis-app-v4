from django.urls import path
from .views import NodeView

urlpatterns = [
    path('api/nodes/', NodeView.as_view()),  # RESTful endpoint
]
