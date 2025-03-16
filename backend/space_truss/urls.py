from django.urls import path
from .views.nodes import NodeView  # ✅ Import Node API
from .views.elements import ElementView  # ✅ Import Element API
from .views.supports import SupportView  # ✅ Import Support API

urlpatterns = [
    path("api/nodes/", NodeView.as_view(), name="nodes-api"),
    path("api/elements/", ElementView.as_view(), name="elements-api"),
    path("api/supports/", SupportView.as_view(), name="supports-api"),
]
