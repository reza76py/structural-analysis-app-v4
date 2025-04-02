from django.urls import path
from .views.nodes import NodeView
from .views.elements import ElementView, ElementDirectionCosinesView, ElementTransformationMatrixView, ElementLocalStiffnessMatrixView, ElementGlobalStiffnessPerElementView
from .views.supports import SupportView
from .views.loads import LoadView
from .views.elements import ElementLocalStiffnessMatrixView
from .views.dof_indices import ElementDOFIndicesView
from .views.load_vector import LoadVectorView
from .views.global_stiffness_save import SaveAssembledGlobalStiffnessView
from .views.apply_boundary_conditions import ApplyBoundaryConditionsView
from .views.solve_displacement import SolveDisplacementView
from .views.solve_reaction import SolveReactionView
from .views.internal_axial_forces import InternalAxialForceView




urlpatterns = [
    path("api/nodes/", NodeView.as_view(), name="nodes-api"),
    path("api/elements/", ElementView.as_view(), name="elements-api"),
    path("api/supports/", SupportView.as_view(), name="supports-api"),
    path("api/loads/", LoadView.as_view(), name="loads"),
    path("api/elements/direction-cosines/", ElementDirectionCosinesView.as_view(), name="element-direction-cosines"),
    path("api/elements/transformation-matrix/", ElementTransformationMatrixView.as_view(), name="element-transformation-matrix"),
    path("api/elements/local-stiffness/", ElementLocalStiffnessMatrixView.as_view(), name="element-local-stiffness"),
    path("api/elements/global-stiffness-per-element/", ElementGlobalStiffnessPerElementView.as_view(), name="element-global-stiffness-per-element"),
    path("api/dof-indices/", ElementDOFIndicesView.as_view(), name="element-dof-indices"),
    path("api/load-vector/", LoadVectorView.as_view(), name="load-vector"),
    path("api/assemble-global-stiffness/", SaveAssembledGlobalStiffnessView.as_view(), name="assemble-global-stiffness"),
    path("api/apply-boundary-conditions/", ApplyBoundaryConditionsView.as_view(), name="apply-boundary-conditions"),
    path("api/solve-displacement/", SolveDisplacementView.as_view(), name="solve-displacement"),
    path("api/solve-reaction/", SolveReactionView.as_view(), name="solve-reaction"),
    path("api/internal-axial-forces/", InternalAxialForceView.as_view(), name="internal-axial-forces")
]
