from django.urls import path
from .views.nodes import NodeView  # ✅ Import Node API
from .views.elements import ElementView, ElementDirectionCosinesView, ElementTransformationMatrixView
from .views.supports import SupportView  # ✅ Import Support API
from .views.loads import LoadView  # ✅ Import Load API

urlpatterns = [
    path("api/nodes/", NodeView.as_view(), name="nodes-api"),
    path("api/elements/", ElementView.as_view(), name="elements-api"),
    path("api/supports/", SupportView.as_view(), name="supports-api"),
    path("api/loads/", LoadView.as_view(), name="loads"),
    path("api/elements/direction-cosines/", ElementDirectionCosinesView.as_view(), name="element-direction-cosines"),
    path("api/elements/transformation-matrix/", ElementTransformationMatrixView.as_view(), name="element-transformation-matrix"),


]
