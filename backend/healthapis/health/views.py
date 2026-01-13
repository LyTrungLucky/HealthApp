from rest_framework import viewsets, generics, permissions, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from datetime import date, timedelta
from .models import (User, HealthProfile, DailyTracking, Exercise, ExerciseCategory,
                     WorkoutPlan, WorkoutSchedule, Food, NutritionPlan, MealSchedule,
                     Progress, Consultation, Reminder, HealthJournal)
from . import serializers
from .serializers import UserRegisterSerializer, UserSerializer, WorkoutPlanSerializer, NutritionPlanSerializer, HealthJournalSerializer


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

    @action(methods=['get'], detail=False, url_path='my-clients')
    def my_clients(self, request):
        """Chuyên gia lấy danh sách khách hàng"""
        user = request.user
        if user.role not in ['nutritionist', 'trainer']:
            return Response({"detail": "Không có quyền"}, status=status.HTTP_403_FORBIDDEN)

        clients = HealthProfile.objects.filter(expert=user).select_related('user')
        data = [{
            'id': c.user.id,
            'username': c.user.username,
            'name': f"{c.user.first_name} {c.user.last_name}".strip() or c.user.username,
            'avatar': c.user.avatar.url if c.user.avatar else None,
            'goal': c.get_goal_display(),
            'weight': c.weight,
            'height': c.height,
            'target_weight': c.target_weight,
            'bmi': c.bmi,
        } for c in clients]

        return Response(data)

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

    # method weekly summary
    @action(methods=['get'], detail=False, url_path='weekly-summary')
    def weekly_summary(self, request):
        from datetime import date, timedelta
        from django.db.models import Avg, Count, Sum

        end_date = date.today()
        start_date = end_date - timedelta(days=7)

        trackings = DailyTracking.objects.filter(
            user=request.user,
            date__range=[start_date, end_date]
        )

        # Tính toán
        water_avg = trackings.aggregate(avg=Avg('water_intake'))['avg'] or 0
        water_avg_liters = round(water_avg / 1000, 1)  # Convert ml to L

        workout_count = trackings.filter(steps__gte=5000).count()

        # Estimate calories from steps (rough calculation)
        total_steps = trackings.aggregate(sum=Sum('steps'))['sum'] or 0
        calories_total = int(total_steps * 0.04)  # ~0.04 calories per step

        return Response({
            'water_avg': water_avg_liters,
            'workout_count': workout_count,
            'calories_total': calories_total
        })


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
class WorkoutPlanViewSet(viewsets.ModelViewSet):
    serializer_class = WorkoutPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    # ===================== QUERYSET =====================
    def get_queryset(self):
        """
        User chỉ thấy workout plan của mình
        Trainer thấy các plan do mình tạo
        """
        user = self.request.user

        if user.role == 'trainer':
            return WorkoutPlan.objects.filter(created_by=user)
        return WorkoutPlan.objects.filter(user=user)

    # ===================== CREATE =====================
    def perform_create(self, serializer):
        """
        Tạo workout plan cho user hiện tại
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
        Lấy workout plan mẫu (trainer tạo)
        """
        goal = request.query_params.get('goal', 'maintain')

        templates = WorkoutPlan.objects.filter(
            goal=goal,
            created_by__role='trainer',
            active=True
        ).order_by('-created_date')[:3]

        serializer = self.get_serializer(templates, many=True)
        return Response(serializer.data)

    # ===================== CLONE PLAN =====================
    @action(methods=['post'], detail=True, url_path='clone')
    def clone_plan(self, request, pk=None):
        """
        Clone workout plan mẫu cho user
        """
        template = self.get_object()

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
        Thêm bài tập vào workout plan
        """
        plan = self.get_object()

        exercise_id = request.data.get('exercise_id')
        weekday = request.data.get('weekday')
        sets = request.data.get('sets', 3)
        reps = request.data.get('reps', 10)
        notes = request.data.get('notes', '')

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
            sets=sets,
            reps=reps,
            notes=notes
        )

        return Response(
            {
                "detail": "Thêm bài tập thành công",
                "schedule_id": schedule.id
            },
            status=status.HTTP_201_CREATED
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
class NutritionPlanViewSet(viewsets.ModelViewSet):
    serializer_class = NutritionPlanSerializer
    permission_classes = [permissions.IsAuthenticated]

    # ===================== QUERYSET =====================
    def get_queryset(self):
        """
        User chỉ thấy nutrition plan của mình
        Nutritionist thấy plan do mình tạo
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
        Lấy nutrition plan mẫu do nutritionist tạo
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

        meals = MealSchedule.objects.filter(nutrition_plan=template)
        for meal in meals:
            MealSchedule.objects.create(
                nutrition_plan=new_plan,
                food=meal.food,
                weekday=meal.weekday,
                portion=meal.portion,
                notes=meal.notes
            )

        serializer = self.get_serializer(new_plan)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    # ===================== ADD MEAL =====================
    @action(methods=['post'], detail=True, url_path='add-meal')
    def add_meal(self, request, pk=None):
        """
        Thêm bữa ăn vào nutrition plan
        """
        plan = self.get_object()

        food_id = request.data.get('food_id')
        weekday = request.data.get('weekday')
        portion = request.data.get('portion', 1)
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

    @action(methods=['get'], detail=False, url_path='client/(?P<client_id>[^/.]+)')
    def get_client_progress(self, request, client_id=None):
        """Chuyên gia xem tiến độ của 1 khách hàng"""
        user = request.user
        if user.role not in ['nutritionist', 'trainer']:
            return Response({"detail": "Không có quyền"}, status=status.HTTP_403_FORBIDDEN)

        # Kiểm tra client thuộc expert này
        try:
            profile = HealthProfile.objects.get(user_id=client_id, expert=user)
        except HealthProfile.DoesNotExist:
            return Response({"detail": "Không tìm thấy"}, status=status.HTTP_404_NOT_FOUND)

        days = int(request.query_params.get('days', 30))
        end_date = date.today()
        start_date = end_date - timedelta(days=days)

        # Lấy progress
        progress = Progress.objects.filter(
            user_id=client_id, date__range=[start_date, end_date]
        ).values('date', 'weight', 'body_fat', 'muscle_mass')

        # Lấy daily tracking
        tracking = DailyTracking.objects.filter(
            user_id=client_id, date__range=[start_date, end_date]
        ).values('date', 'weight', 'water_intake', 'steps')

        return Response({
            'client': {
                'id': profile.user.id,
                'name': f"{profile.user.first_name} {profile.user.last_name}".strip(),
                'goal': profile.get_goal_display(),
                'current_weight': profile.weight,
                'target_weight': profile.target_weight,
                'bmi': profile.bmi,
            },
            'progress': list(progress),
            'tracking': list(tracking),
        })


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


class ReminderViewSet(viewsets.ModelViewSet):
    serializer_class = serializers.ReminderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Reminder.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(methods=['get'], detail=False, url_path='today')
    def get_today_reminders(self, request):
        from datetime import date
        today_weekday = date.today().weekday()
        reminders = Reminder.objects.filter(
            user=request.user,
            is_enabled=True,
            days_of_week__contains=today_weekday
        ).order_by('time')
        return Response(self.get_serializer(reminders, many=True).data)

    @action(methods=['patch'], detail=True, url_path='toggle')
    def toggle_reminder(self, request, pk=None):
        reminder = self.get_object()
        reminder.is_enabled = not reminder.is_enabled
        reminder.save()
        return Response(self.get_serializer(reminder).data)


class HealthJournalViewSet(viewsets.ModelViewSet):
    serializer_class = HealthJournalSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return HealthJournal.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(methods=['get'], detail=False, url_path='today')
    def get_today(self, request):
        today = date.today()
        journal = HealthJournal.objects.filter(user=request.user, date=today).first()
        if journal:
            return Response(HealthJournalSerializer(journal).data)
        return Response({"detail": "Chưa có nhật ký hôm nay"}, status=404)

    @action(methods=['get'], detail=False, url_path='month/(?P<year>\d+)/(?P<month>\d+)')
    def get_by_month(self, request, year, month):
        journals = HealthJournal.objects.filter(
            user=request.user,
            date__year=year,
            date__month=month
        )
        return Response(HealthJournalSerializer(journals, many=True).data)


