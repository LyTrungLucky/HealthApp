from rest_framework import serializers
from .models import (User, HealthProfile, DailyTracking, Exercise, ExerciseCategory,
                     WorkoutPlan, WorkoutSchedule, Food, NutritionPlan, MealSchedule,
                     Progress, Consultation, Reminder, HealthJournal, ChatRoom, Message)
from cloudinary.utils import cloudinary_url


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
            role='user',
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
    image_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Exercise
        fields = '__all__'  # SerializerMethodField sẽ được thêm tự động

    def _build_cloudinary_url(self, public_id):
        if not public_id:
            return None
        try:
            from cloudinary.utils import cloudinary_url
            url, _ = cloudinary_url(public_id)
            return url
        except Exception:
            return None

    def _get_field_url(self, obj, field_name):
        val = getattr(obj, field_name, None)
        if not val:
            return None
        request = self.context.get('request')
        if hasattr(val, 'url'):
            try:
                return request.build_absolute_uri(val.url) if request else val.url
            except Exception:
                pass
        if isinstance(val, str) and val.strip():
            s = val.strip()
            if s.startswith('http://') or s.startswith('https://'):
                return s
            return self._build_cloudinary_url(s)
        if isinstance(val, dict):
            if val.get('url'):
                return val.get('url')
            public_id = val.get('public_id') or val.get('publicId') or val.get('id')
            return self._build_cloudinary_url(public_id)
        if hasattr(val, 'file') and hasattr(val.file, 'url'):
            try:
                return request.build_absolute_uri(val.file.url) if request else val.file.url
            except Exception:
                pass
        return None

    def get_image_url(self, obj):
        return self._get_field_url(obj, 'image')

    def get_video_url(self, obj):
        return self._get_field_url(obj, 'video')

class ExerciseDetailSerializer(serializers.ModelSerializer):
    category = ExerciseCategorySerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    video_url = serializers.SerializerMethodField()

    class Meta:
        model = Exercise
        fields = [
            'id',
            'name',
            'description',
            'instructions',
            'image',      # keep raw if you need
            'image_url',  # absolute URL for frontend
            'video_url',
            'duration',
            'calories_burned',
            'difficulty',
            'category'
        ]

    def _build_cloudinary_url(self, public_id):
        if not public_id:
            return None
        try:
            url, _ = cloudinary_url(public_id)
            return url
        except Exception:
            return None

    def _get_field_url(self, obj, field_name):
        val = getattr(obj, field_name, None)
        if not val:
            return None
        request = self.context.get('request')
        # If FieldFile or has .url
        if hasattr(val, 'url'):
            try:
                return request.build_absolute_uri(val.url) if request else val.url
            except Exception:
                pass
        # Plain string (could be full URL or cloudinary public id / path)
        if isinstance(val, str) and val.strip():
            s = val.strip()
            if s.startswith('http://') or s.startswith('https://'):
                return s
            # If looks like cloudinary public id or path, build URL
            return self._build_cloudinary_url(s)
        # dict-like from some storages
        if isinstance(val, dict):
            if val.get('url'):
                return val.get('url')
            public_id = val.get('public_id') or val.get('publicId') or val.get('id')
            return self._build_cloudinary_url(public_id)
        # nested file object
        if hasattr(val, 'file') and hasattr(val.file, 'url'):
            try:
                return request.build_absolute_uri(val.file.url) if request else val.file.url
            except Exception:
                pass
        return None

    def get_image_url(self, obj):
        return self._get_field_url(obj, 'image')

    def get_video_url(self, obj):
        return self._get_field_url(obj, 'video')

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
    expert = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role__in=['nutritionist', 'trainer'])
    )
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


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    sender_avatar = serializers.SerializerMethodField()
    is_mine = serializers.SerializerMethodField()

    class Meta:
        model = Message
        fields = ['id', 'content', 'sender', 'sender_name', 'sender_avatar',
                  'is_mine', 'is_read', 'created_date']

    def get_sender_name(self, obj):
        return f"{obj.sender.first_name} {obj.sender.last_name}".strip() or obj.sender.username

    def get_sender_avatar(self, obj):
        return obj.sender.avatar.url if obj.sender.avatar else None

    def get_is_mine(self, obj):
        request = self.context.get('request')
        return obj.sender == request.user if request else False


class ChatRoomSerializer(serializers.ModelSerializer):
    other_user = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = ChatRoom
        fields = ['id', 'other_user', 'last_message', 'last_message_time', 'unread_count']

    def get_other_user(self, obj):
        request = self.context.get('request')
        other = obj.expert if obj.user == request.user else obj.user
        return {
            'id': other.id,
            'name': f"{other.first_name} {other.last_name}".strip() or other.username,
            'avatar': other.avatar.url if other.avatar else None,
            'role': other.get_role_display()
        }

    def get_unread_count(self, obj):
        request = self.context.get('request')
        return obj.messages.filter(is_read=False).exclude(sender=request.user).count()