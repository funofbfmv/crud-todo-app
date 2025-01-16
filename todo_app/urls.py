from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

def api_root(request):
    return JsonResponse({
        "users": "/api/users/",
        "todo": "/api/todo/"
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root),  
    path('api/users/', include('apps.users.urls')),  
    path('api/todo/', include('apps.todo.urls')),  
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]