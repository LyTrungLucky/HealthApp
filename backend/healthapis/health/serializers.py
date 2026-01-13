from rest_framework import serializers
from .models import (User, HealthProfile, DailyTracking, Exercise, ExerciseCategory,
                     WorkoutPlan, WorkoutSchedule, Food, NutritionPlan, MealSchedule,
                     Progress, Consultation, Reminder, HealthJournal)


class UserSerializer(serializers.ModelSerializer):
    avatar = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'avatar', 'role',]

    def get_avatar(self, obj):
        return obj.avatar.url if obj.avatar else ''


class UserRegisterSerializer(serializers.ModelSerializer):
    confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'username',
            'password',
            'confirm',
            'first_name',
            'last_name',
            'avatar',
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['confirm']:
            raise serializers.ValidationError({
                "password": "Mật khẩu không khớp"
            })
        return data

    def create(self, validated_data):
        validated_data.pop('confirm')
        password = validated_data.pop('password')

        user = User.objects.create_user(
            password=password,
            role='user',  # ✅ FIX CỨNG
            **validated_data
        )
        return user

class HealthProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    expert = UserSerializer(read_only=True)
    bmi = serializers.ReadOnlyField()
    bmi_status = serializers.SerializerMethodField()

    class Meta:
        model = HealthProfile
        fields = '__all__'

    def get_bmi_status(self, obj):
        bmi = obj.bmi
        if bmi < 18.5:
            return "Thiếu cân"
        elif 18.5 <= bmi < 25:
            return "Bình thường"
        elif 25 <= bmi < 30:
            return "Thừa cân"
        else:
            return "Béo phì"


class DailyTrackingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = DailyTracking
        fields = '__all__'


class ExerciseCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseCategory
        fields = '__all__'


class ExerciseSerializer(serializers.ModelSerializer):
    category = ExerciseCategorySerializer(read_only=True)
    category_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Exercise
        fields = '__all__'


class ExerciseDetailSerializer(serializers.ModelSerializer):
    category = ExerciseCategorySerializer(read_only=True)

    class Meta:
        model = Exercise
        fields = [
            'id',
            'name',
            'description',
            'instructions',
            'image',
            'video_url',
            'duration',
            'calories_burned',
            'difficulty',
            'category'
        ]


class WorkoutScheduleSerializer(serializers.ModelSerializer):
    exercise = ExerciseSerializer(read_only=True)
    exercise_id = serializers.IntegerField(write_only=True)
    weekday_display = serializers.CharField(source='get_weekday_display', read_only=True)

    class Meta:
        model = WorkoutSchedule
        fields = '__all__'


class WorkoutPlanSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    schedules = WorkoutScheduleSerializer(many=True, read_only=True)
    total_exercises = serializers.SerializerMethodField()

    class Meta:
        model = WorkoutPlan
        fields = [
            'id',
            'name',
            'goal',
            'description',
            'start_date',
            'end_date',
            'active',

            'user',
            'created_by',
            'created_date',

            'schedules',
            'total_exercises',
        ]
        read_only_fields = [
            'user',
            'created_by',
            'created_date',
            'schedules',
            'total_exercises',
        ]

    def get_total_exercises(self, obj):
        return obj.schedules.count()



class FoodSerializer(serializers.ModelSerializer):
    meal_type_display = serializers.CharField(source='get_meal_type_display', read_only=True)

    class Meta:
        model = Food
        fields = '__all__'


class MealScheduleSerializer(serializers.ModelSerializer):
    food = FoodSerializer(read_only=True)
    food_id = serializers.IntegerField(write_only=True)
    weekday_display = serializers.CharField(source='get_weekday_display', read_only=True)
    total_calories = serializers.SerializerMethodField()

    class Meta:
        model = MealSchedule
        fields = '__all__'

    def get_total_calories(self, obj):
        return int(obj.food.calories * obj.portion)


class NutritionPlanSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    meal_schedules = MealScheduleSerializer(many=True, read_only=True)
    total_meals = serializers.SerializerMethodField()

    class Meta:
        model = NutritionPlan
        fields = [
            'id',
            'name',
            'goal',
            'description',
            'daily_calories',
            'start_date',
            'end_date',
            'active',

            'user',
            'created_by',
            'created_date',

            'meal_schedules',
            'total_meals',
        ]
        read_only_fields = [
            'user',
            'created_by',
            'created_date',
            'meal_schedules',
            'total_meals',
        ]

    def get_total_meals(self, obj):
        return obj.meal_schedules.count()


class ProgressSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    weight_change = serializers.SerializerMethodField()

    class Meta:
        model = Progress
        fields = '__all__'

    def get_weight_change(self, obj):
        previous = Progress.objects.filter(
            user=obj.user,
            date__lt=obj.date
        ).order_by('-date').first()

        if previous:
            change = obj.weight - previous.weight
            return round(change, 2)
        return None


class ConsultationSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    expert = UserSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Consultation
        fields = '__all__'


# Serializer cho đăng ký
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['username', 'password', 'password2', 'email', 'first_name',
                  'last_name', 'role', 'phone']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError("Mật khẩu không khớp!")
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user


class ReminderSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    reminder_type_display = serializers.CharField(source='get_reminder_type_display', read_only=True)

    class Meta:
        model = Reminder
        fields = '__all__'


class HealthJournalSerializer(serializers.ModelSerializer):
    mood_display = serializers.CharField(source='get_mood_display', read_only=True)

    class Meta:
        model = HealthJournal
        fields = ['id', 'date', 'title', 'content', 'mood', 'mood_display',
                  'workout_completed', 'workout_notes', 'energy_level',
                  'sleep_hours', 'image', 'created_date']
        read_only_fields = ['id', 'created_date']