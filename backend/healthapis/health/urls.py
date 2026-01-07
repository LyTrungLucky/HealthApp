from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import ExpertViewSet

router = DefaultRouter()
router.register('users', views.UserViewSet, basename='user')
router.register(  r'experts',  ExpertViewSet, basename='experts')

router.register('health-profiles', views.HealthProfileViewSet, basename='health-profile')
router.register('daily-tracking', views.DailyTrackingViewSet, basename='daily-tracking')
router.register('exercise-categories', views.ExerciseCategoryViewSet, basename='exercise-category')
router.register('exercises', views.ExerciseViewSet, basename='exercise')
router.register('workout-plans', views.WorkoutPlanViewSet, basename='workout-plan')
router.register('foods', views.FoodViewSet, basename='food')
router.register('nutrition-plans', views.NutritionPlanViewSet, basename='nutrition-plan')
router.register('progress', views.ProgressViewSet, basename='progress')
router.register('consultations', views.ConsultationViewSet, basename='consultation')

urlpatterns = [
    path('', include(router.urls)),
    path('register/', views.RegisterView.as_view(), name='register'),
]