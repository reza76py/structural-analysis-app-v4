from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('space_truss.urls')),
    path('file/', include('file_input.urls')),
]
