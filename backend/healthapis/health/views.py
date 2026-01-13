from rest_framework import viewsets, generics, permissions, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from datetime import date, timedelta
from .models import (User, HealthProfile, DailyTracking, Exercise, ExerciseCategory,
                     WorkoutPlan, WorkoutSchedule, Food, NutritionPlan, MealSchedule,
                     Progress, Consultation)
from . import serializers
from .serializers import UserRegisterSerializer, UserSerializer, WorkoutPlanSerializer, NutritionPlanSerializer, \
    MealScheduleSerializer


# Authentication Views
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

class UserViewSet(viewsets.ViewSet):
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [parsers.MultiPartParser, parsers.FormParser]

    @action(methods=['get', 'patch'], detail=False, url_path='current-user')
    def current_user(self, request):
        user = request.user

        if request.method == 'PATCH':
            for k in ['first_name', 'last_name', 'email']:
                if k in request.data:
                    setattr(user, k, request.data[k])
            user.save()

        return Response(
            serializers.UserSerializer(user).data,
            status=status.HTTP_200_OK
        )

class ExpertViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        qs = User.objects.filter(
            role__in=['nutritionist', 'trainer']
        )

        role = self.request.query_params.get('role')
        if role:
            qs = qs.filter(role=role)

        return qs



# Health Profile Views
class HealthProfileViewSet(viewsets.ModelViewSet):
    queryset = HealthProfile.objects.all()
    serializer_class = serializers.HealthProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if self.request.user.role in ['nutritionist', 'trainer']:
            return HealthProfile.objects.filter(expert=self.request.user)
        return HealthProfile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(methods=['get'], detail=False, url_path='my-profile')
    def my_profile(self, request):
        try:
            profile = HealthProfile.objects.get(user=request.user)
            return Response(serializers.HealthProfileSerializer(profile).data)
        except HealthProfile.DoesNotExist:
            return Response({"detail": "Chưa có hồ sơ sức khỏe"},
                            status=status.HTTP_404_NOT_FOUND)


# Daily Tracking Views
class DailyTrackingViewSet(viewsets.ModelViewSet):
    queryset = DailyTracking.objects.all()
    serializer_class = serializers.DailyTrackingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = DailyTracking.objects.filter(user=self.request.user)
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(methods=['get'], detail=False, url_path='today')
    def get_today(self, request):
        today = date.today()
        tracking, created = DailyTracking.objects.get_or_create(
            user=request.user,
            date=today
        )
        return Response(serializers.DailyTrackingSerializer(tracking).data)

    @action(methods=['get'], detail=False, url_path='weekly-summary')
    def weekly_summary(self, request):
        end_date = date.today()
        start_date = end_date - timedelta(days=7)
        trackings = DailyTracking.objects.filter(
            user=request.user,
            date__range=[start_date, end_date]
        )
        return Response(serializers.DailyTrackingSerializer(trackings, many=True).data)


# Exercise Views
class ExerciseCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ExerciseCategory.objects.all()
    serializer_class = serializers.ExerciseCategorySerializer
    permission_classes = [permissions.IsAuthenticated]


class ExerciseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Exercise.objects.filter(active=True)
    serializer_class = serializers.ExerciseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        category_id = self.request.query_params.get('category_id')
        difficulty = self.request.query_params.get('difficulty')
        search = self.request.query_params.get('search')

        if category_id:
            queryset = queryset.filter(category_id=category_id)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        if search:
            queryset = queryset.filter(Q(name__icontains=search) |
                                       Q(description__icontains=search))

        return queryset

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = serializers.ExerciseDetailSerializer(instance)
        return Response(serializer.data)

    @action(methods=['get'], detail=False, url_path='recommended')
    def get_recommended(self, request):
        try:
            profile = HealthProfile.objects.get(user=request.user)
            if profile.goal == 'lose_weight':
                exercises = Exercise.objects.filter(
                    active=True,
                    category__name__in=['Cardio', 'HIIT']
                )[:10]
            elif profile.goal == 'gain_muscle':
                exercises = Exercise.objects.filter(
                    active=True,
                    category__name__in=['Strength', 'Weightlifting']
                )[:10]
            else:
                exercises = Exercise.objects.filter(active=True)[:10]

            return Response(serializers.ExerciseSerializer(exercises, many=True).data)
        except HealthProfile.DoesNotExist:
            return Response({"detail": "Vui lòng tạo hồ sơ sức khỏe"},
                            status=status.HTTP_404_NOT_FOUND)


# Workout Plan Views
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from datetime import date, timedelta

from .models import WorkoutPlan, WorkoutSchedule, Exercise
from .serializers import WorkoutPlanSerializer, WorkoutScheduleSerializer


class WorkoutPlanViewSet(viewsets.ModelViewSet):
    """
    - User: chỉ thấy & chỉnh sửa workout plan của mình
    - Trainer: thấy các plan do mình tạo (template)
    """
    serializer_class = WorkoutPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    # ===================== QUERYSET =====================
    def get_queryset(self):
        user = self.request.user

        if user.role == 'trainer':
            return WorkoutPlan.objects.filter(
                created_by=user,
                active=True
            )

        return WorkoutPlan.objects.filter(
            user=user,
            active=True
        )

    # ===================== CREATE =====================
    def perform_create(self, serializer):
        """
        User tạo workout plan cho chính mình
        """
        serializer.save(
            user=self.request.user,
            created_by=self.request.user,
            active=True
        )

    # ===================== TEMPLATE PLANS =====================
    @action(methods=['get'], detail=False, url_path='templates')
    def get_templates(self, request):
        """
        Lấy workout plan mẫu do trainer tạo
        """
        goal = request.query_params.get('goal', 'maintain')

        templates = WorkoutPlan.objects.filter(
            goal=goal,
            created_by__role='trainer',
            active=True
        ).order_by('-created_date')[:3]

        serializer = self.get_serializer(templates, many=True)
        return Response(serializer.data)

    # ===================== GET SCHEDULES =====================
    @action(methods=['get'], detail=True, url_path='schedules')
    def get_schedules(self, request, pk=None):
        """
        Lấy lịch tập của workout plan
        (cho phép đọc cả template)
        """
        try:
            plan = WorkoutPlan.objects.get(
                id=pk,
                active=True
            )
        except WorkoutPlan.DoesNotExist:
            return Response(
                {"detail": "Workout plan không tồn tại"},
                status=status.HTTP_404_NOT_FOUND
            )

        schedules = WorkoutSchedule.objects.filter(workout_plan=plan)
        serializer = WorkoutScheduleSerializer(schedules, many=True)
        return Response(serializer.data)

    # ===================== CLONE PLAN =====================
    @action(methods=['post'], detail=True, url_path='clone')
    def clone_plan(self, request, pk=None):
        """
        Clone workout plan mẫu (trainer) cho user
        """
        try:
            template = WorkoutPlan.objects.get(
                id=pk,
                created_by__role='trainer',
                active=True
            )
        except WorkoutPlan.DoesNotExist:
            return Response(
                {"detail": "Workout plan mẫu không tồn tại"},
                status=status.HTTP_404_NOT_FOUND
            )

        new_plan = WorkoutPlan.objects.create(
            user=request.user,
            created_by=request.user,
            name=f"{template.name} (Bản sao)",
            goal=template.goal,
            description=template.description,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=28),
            active=True
        )

        schedules = WorkoutSchedule.objects.filter(workout_plan=template)
        for s in schedules:
            WorkoutSchedule.objects.create(
                workout_plan=new_plan,
                exercise=s.exercise,
                weekday=s.weekday,
                sets=s.sets,
                reps=s.reps,
                notes=s.notes
            )

        serializer = self.get_serializer(new_plan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # ===================== ADD EXERCISE =====================
    @action(methods=['post'], detail=True, url_path='add-exercise')
    def add_exercise(self, request, pk=None):
        """
        Thêm bài tập vào workout plan của user
        (KHÔNG cho sửa template)
        """
        try:
            plan = WorkoutPlan.objects.get(
                id=pk,
                user=request.user,
                active=True
            )
        except WorkoutPlan.DoesNotExist:
            return Response(
                {"detail": "Workout plan không tồn tại hoặc không có quyền"},
                status=status.HTTP_404_NOT_FOUND
            )

        exercise_id = request.data.get('exercise_id')
        weekday = request.data.get('weekday')

        if not exercise_id or weekday is None:
            return Response(
                {"detail": "exercise_id và weekday là bắt buộc"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            exercise = Exercise.objects.get(id=exercise_id)
        except Exercise.DoesNotExist:
            return Response(
                {"detail": "Exercise không tồn tại"},
                status=status.HTTP_404_NOT_FOUND
            )

        schedule = WorkoutSchedule.objects.create(
            workout_plan=plan,
            exercise=exercise,
            weekday=weekday,
            sets=request.data.get('sets', 3),
            reps=request.data.get('reps', 10),
            notes=request.data.get('notes', '')
        )

        return Response(
            {
                "detail": "Thêm bài tập thành công",
                "schedule_id": schedule.id
            },
            status=status.HTTP_201_CREATED
        )

    # ===================== REMOVE EXERCISE =====================
    @action(methods=['delete'], detail=True, url_path='remove-exercise')
    def remove_exercise(self, request, pk=None):
        """
        Xóa bài tập khỏi workout plan của user
        """
        schedule_id = request.data.get('schedule_id')

        if not schedule_id:
            return Response(
                {"detail": "schedule_id là bắt buộc"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            schedule = WorkoutSchedule.objects.get(
                id=schedule_id,
                workout_plan__user=request.user
            )
        except WorkoutSchedule.DoesNotExist:
            return Response(
                {"detail": "Không tìm thấy bài tập hoặc không có quyền"},
                status=status.HTTP_404_NOT_FOUND
            )

        schedule.delete()
        return Response(
            {"detail": "Xóa bài tập thành công"},
            status=status.HTTP_204_NO_CONTENT
        )


# Food Views
class FoodViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Food.objects.filter(active=True)
    serializer_class = serializers.FoodSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = self.queryset
        meal_type = self.request.query_params.get('meal_type')
        search = self.request.query_params.get('search')
        max_calories = self.request.query_params.get('max_calories')

        if meal_type:
            queryset = queryset.filter(meal_type=meal_type)
        if search:
            queryset = queryset.filter(Q(name__icontains=search) |
                                       Q(description__icontains=search))
        if max_calories:
            queryset = queryset.filter(calories__lte=max_calories)

        return queryset

    @action(methods=['get'], detail=False, url_path='recommended')
    def get_recommended(self, request):
        try:
            profile = HealthProfile.objects.get(user=request.user)
            if profile.goal == 'lose_weight':
                foods = Food.objects.filter(active=True, calories__lt=300)[:10]
            elif profile.goal == 'gain_muscle':
                foods = Food.objects.filter(active=True, protein__gte=20)[:10]
            else:
                foods = Food.objects.filter(active=True)[:10]

            return Response(serializers.FoodSerializer(foods, many=True).data)
        except HealthProfile.DoesNotExist:
            return Response({"detail": "Vui lòng tạo hồ sơ sức khỏe"},
                            status=status.HTTP_404_NOT_FOUND)


# Nutrition Plan Views
# health/views.py - NutritionPlanViewSet ĐẦY ĐỦ

class NutritionPlanViewSet(viewsets.ModelViewSet):
    serializer_class = NutritionPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    # ===================== QUERYSET =====================
    def get_queryset(self):
        """
        User chỉ thấy nutrition plan của mình
        Nutritionist thấy các plan do mình tạo
        """
        user = self.request.user

        if user.role == 'nutritionist':
            return NutritionPlan.objects.filter(created_by=user, active=True)
        return NutritionPlan.objects.filter(user=user, active=True)

    # ===================== CREATE =====================
    def perform_create(self, serializer):
        """
        Tạo nutrition plan cho user hiện tại
        """
        serializer.save(
            user=self.request.user,
            created_by=self.request.user,
            active=True
        )

    # ===================== TEMPLATE PLANS =====================
    @action(methods=['get'], detail=False, url_path='templates')
    def get_templates(self, request):
        """
        Lấy nutrition plan mẫu (nutritionist tạo)
        """
        goal = request.query_params.get('goal', 'maintain')

        templates = NutritionPlan.objects.filter(
            goal=goal,
            created_by__role='nutritionist',
            active=True
        ).order_by('-created_date')[:3]

        serializer = self.get_serializer(templates, many=True)
        return Response(serializer.data)

    # ===================== CLONE PLAN =====================
    @action(methods=['post'], detail=True, url_path='clone')
    def clone_plan(self, request, pk=None):
        """
        Clone nutrition plan mẫu cho user
        """
        template = self.get_object()

        new_plan = NutritionPlan.objects.create(
            user=request.user,
            created_by=request.user,
            name=f"{template.name} (Bản sao)",
            goal=template.goal,
            description=template.description,
            daily_calories=template.daily_calories,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=28),
            active=True
        )

        # Clone meal schedules
        meals = MealSchedule.objects.filter(nutrition_plan=template)
        for m in meals:
            MealSchedule.objects.create(
                nutrition_plan=new_plan,
                food=m.food,
                weekday=m.weekday,
                portion=m.portion,
                notes=m.notes
            )

        serializer = self.get_serializer(new_plan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # ===================== GET MEALS =====================
    @action(methods=['get'], detail=True, url_path='meals')
    def get_meals(self, request, pk=None):
        """
        Lấy danh sách bữa ăn của nutrition plan (kể cả template)
        """
        try:
            plan = NutritionPlan.objects.get(
                id=pk,
                active=True
            )
        except NutritionPlan.DoesNotExist:
            return Response(
                {"detail": "Nutrition plan không tồn tại"},
                status=status.HTTP_404_NOT_FOUND
            )

        meals = plan.meal_schedules.all()
        serializer = MealScheduleSerializer(meals, many=True)
        return Response(serializer.data)
    # ===================== ADD MEAL =====================
    @action(methods=['post'], detail=True, url_path='add-meal')
    def add_meal(self, request, pk=None):
        """
        Thêm bữa ăn vào nutrition plan
        """
        plan = self.get_object()

        food_id = request.data.get('food_id')
        weekday = request.data.get('weekday')
        portion = request.data.get('portion', 1.0)
        notes = request.data.get('notes', '')

        if not food_id or weekday is None:
            return Response(
                {"detail": "food_id và weekday là bắt buộc"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            food = Food.objects.get(id=food_id)
        except Food.DoesNotExist:
            return Response(
                {"detail": "Food không tồn tại"},
                status=status.HTTP_404_NOT_FOUND
            )

        meal = MealSchedule.objects.create(
            nutrition_plan=plan,
            food=food,
            weekday=weekday,
            portion=portion,
            notes=notes
        )

        return Response(
            {
                "detail": "Thêm bữa ăn thành công",
                "meal_id": meal.id
            },
            status=status.HTTP_201_CREATED
        )


# Progress Views
class ProgressViewSet(viewsets.ModelViewSet):
    queryset = Progress.objects.all()
    serializer_class = serializers.ProgressSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = Progress.objects.filter(user=self.request.user)
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')

        if start_date:
            queryset = queryset.filter(date__gte=start_date)
        if end_date:
            queryset = queryset.filter(date__lte=end_date)

        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(methods=['get'], detail=False, url_path='chart-data')
    def get_chart_data(self, request):
        days = int(request.query_params.get('days', 30))
        end_date = date.today()
        start_date = end_date - timedelta(days=days)

        progress = Progress.objects.filter(
            user=request.user,
            date__range=[start_date, end_date]
        ).values('date', 'weight', 'body_fat', 'muscle_mass')

        return Response(list(progress))


# Consultation Views
class ConsultationViewSet(viewsets.ModelViewSet):
    queryset = Consultation.objects.all()
    serializer_class = serializers.ConsultationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role in ['nutritionist', 'trainer']:
            return Consultation.objects.filter(expert=user)
        return Consultation.objects.filter(user=user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(methods=['patch'], detail=True, url_path='update-status')
    def update_status(self, request, pk=None):
        consultation = self.get_object()
        new_status = request.data.get('status')

        if new_status not in dict(Consultation.STATUS_CHOICES):
            return Response({"detail": "Trạng thái không hợp lệ"},
                            status=status.HTTP_400_BAD_REQUEST)

        consultation.status = new_status
        consultation.save()
        return Response(serializers.ConsultationSerializer(consultation).data)

    @action(methods=['get'], detail=False, url_path='upcoming')
    def get_upcoming(self, request):
        upcoming = self.get_queryset().filter(
            appointment_date__gte=date.today(),
            status__in=['pending', 'confirmed']
        ).order_by('appointment_date')
        return Response(serializers.ConsultationSerializer(upcoming, many=True).data)