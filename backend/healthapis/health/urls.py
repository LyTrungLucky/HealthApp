from rest_framework import routers
from django.urls import path, include
from .views import UserViewSet, UserProfileViewSet

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'profiles', UserProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
