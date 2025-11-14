from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinValueValidator, MaxValueValidator
from cloudinary.models import CloudinaryField
from django.utils import timezone


# ========================
# ENUMS - Dùng TextChoices cho đơn giản
# ========================
class UserRole(models.TextChoices):
    USER = "USER", "User"
    SPECIALIST = "SPECIALIST", "Specialist"


class TrackingMode(models.TextChoices):
    PERSONAL = "PERSONAL", "Personal"
    WITH_SPECIALIST = "WITH_SPECIALIST", "With Specialist"


class GoalType(models.TextChoices):
    WEIGHT_LOSS = "WEIGHT_LOSS", "Weight Loss"
    MUSCLE_GAIN = "MUSCLE_GAIN", "Muscle Gain"
    MAINTAIN = "MAINTAIN", "Maintain"


class MealTime(models.TextChoices):
    BREAKFAST = "BREAKFAST", "Breakfast"
    LUNCH = "LUNCH", "Lunch"
    DINNER = "DINNER", "Dinner"
    SNACK = "SNACK", "Snack"


# ========================
# ABSTRACT BASE - Tái sử dụng timestamp
# ========================
class BaseModel(models.Model):
    """Base model cho tất cả models"""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


# ========================
# USER
# ========================
class User(AbstractUser):
    """User mở rộng"""
    avatar = CloudinaryField(null=True, blank=True)
    role = models.CharField(
        max_length=20,
        choices=UserRole.choices,
        default=UserRole.USER
    )
    tracking_mode = models.CharField(
        max_length=20,
        choices=TrackingMode.choices,
        default=TrackingMode.PERSONAL
    )
    phone = models.CharField(max_length=15, blank=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.username


class UserProfile(BaseModel):
    """Thông tin cá nhân và mục tiêu"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')

    # Thông tin cơ bản
    height = models.FloatField(null=True, blank=True, help_text="cm")
    weight = models.FloatField(null=True, blank=True, help_text="kg")
    age = models.IntegerField(null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=[('MALE', 'Male'), ('FEMALE', 'Female'), ('OTHER', 'Other')],
        blank=True
    )

    # Mục tiêu
    goal_type = models.CharField(
        max_length=30,
        choices=GoalType.choices,
        null=True,
        blank=True
    )
    target_weight = models.FloatField(null=True, blank=True)

    # Daily targets
    daily_water_goal = models.FloatField(default=2.0, help_text="liters")
    daily_steps_goal = models.IntegerField(default=10000)
    daily_calories_goal = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'user_profiles'

    def __str__(self):
        return f"{self.user.username}'s profile"

    @property
    def bmi(self):
        """Tính BMI"""
        if self.weight and self.height:
            height_m = self.height / 100
            return round(self.weight / (height_m ** 2), 2)
        return None


class SpecialistProfile(BaseModel):
    """Thông tin chuyên gia - chỉ cho user có role=SPECIALIST"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='specialist_info')
    specialization = models.CharField(max_length=100, help_text="Nutrition/Fitness/Both")
    bio = models.TextField(blank=True)
    experience_years = models.IntegerField(default=0)
    rating = models.FloatField(default=0.0)

    class Meta:
        db_table = 'specialist_profiles'

    def __str__(self):
        return f"{self.user.username} - {self.specialization}"


class UserSpecialistConnection(BaseModel):
    """Kết nối User với Specialist"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='my_specialists')
    specialist = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='my_clients',
        limit_choices_to={'role': UserRole.SPECIALIST}
    )
    status = models.CharField(
        max_length=20,
        choices=[
            ('PENDING', 'Pending'),
            ('ACTIVE', 'Active'),
            ('ENDED', 'Ended'),
        ],
        default='PENDING'
    )
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'user_specialist_connections'
        unique_together = ('user', 'specialist')

    def __str__(self):
        return f"{self.user.username} <-> {self.specialist.username}"


# ========================
# DAILY TRACKING - Track theo ngày
# ========================
class DailyLog(BaseModel):
    """Log hàng ngày - tất cả metrics trong 1 bảng"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_logs')
    date = models.DateField(default=timezone.now)

    # Body metrics
    weight = models.FloatField(null=True, blank=True)

    # Activity
    water_intake = models.FloatField(default=0, help_text="liters")
    steps_count = models.IntegerField(default=0)
    sleep_hours = models.FloatField(null=True, blank=True)

    # Calories
    calories_consumed = models.IntegerField(default=0)
    calories_burned = models.IntegerField(default=0)

    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'daily_logs'
        unique_together = ('user', 'date')
        ordering = ['-date']
        indexes = [
            models.Index(fields=['user', '-date']),
        ]

    def __str__(self):
        return f"{self.user.username} - {self.date}"


# ========================
# EXERCISE & WORKOUT (OFFLINE)
# ========================
class Exercise(BaseModel):
    """Bài tập cơ bản"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    muscle_group = models.CharField(max_length=50, blank=True)
    video_url = models.URLField(blank=True)
    image = CloudinaryField(null=True, blank=True)

    # Metrics mặc định
    calories_per_minute = models.FloatField(default=5.0)
    difficulty = models.CharField(
        max_length=20,
        choices=[
            ('BEGINNER', 'Beginner'),
            ('INTERMEDIATE', 'Intermediate'),
            ('ADVANCED', 'Advanced'),
        ],
        default='BEGINNER'
    )

    class Meta:
        db_table = 'exercises'

    def __str__(self):
        return self.name


class Workout(BaseModel):
    """Bộ tập luyện - chứa nhiều exercises"""
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    goal_type = models.CharField(
        max_length=30,
        choices=GoalType.choices,
        blank=True
    )
    exercises = models.ManyToManyField(Exercise, through='WorkoutExercise')

    total_duration = models.IntegerField(default=0, help_text="minutes")

    class Meta:
        db_table = 'workouts'

    def __str__(self):
        return self.name


class WorkoutExercise(models.Model):
    """Exercise trong workout với chi tiết"""
    workout = models.ForeignKey(Workout, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    order = models.IntegerField(default=0)

    sets = models.IntegerField(default=3)
    reps = models.IntegerField(null=True, blank=True)
    duration_minutes = models.IntegerField(null=True, blank=True)
    rest_seconds = models.IntegerField(default=60)

    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'workout_exercises'
        ordering = ['order']

    def __str__(self):
        return f"{self.workout.name} - {self.exercise.name}"


class WorkoutPlan(BaseModel):
    """Kế hoạch tập luyện của user"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_plans')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    # Schedule đơn giản: JSON {day_of_week: workout_id}
    # {0: 1, 2: 3, 4: 1} = Monday workout 1, Wednesday workout 3, Friday workout 1
    weekly_schedule = models.JSONField(default=dict)

    is_active = models.BooleanField(default=True)
    assigned_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_workout_plans',
        limit_choices_to={'role': UserRole.SPECIALIST}
    )

    class Meta:
        db_table = 'workout_plans'

    def __str__(self):
        return f"{self.name} - {self.user.username}"


class WorkoutLog(BaseModel):
    """Log buổi tập thực tế"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_logs')
    workout = models.ForeignKey(Workout, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField(default=timezone.now)

    duration_minutes = models.IntegerField()
    calories_burned = models.IntegerField(default=0)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'workout_logs'
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.date}"


# ========================
# FOOD & NUTRITION (OFFLINE)
# ========================
class FoodItem(BaseModel):
    """Thực phẩm cơ bản"""
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    image = CloudinaryField(null=True, blank=True)

    # Per 100g
    serving_size = models.CharField(max_length=50, default="100g")
    calories = models.FloatField(default=0)
    protein = models.FloatField(default=0)
    carbs = models.FloatField(default=0)
    fat = models.FloatField(default=0)

    class Meta:
        db_table = 'food_items'

    def __str__(self):
        return self.name


class Meal(BaseModel):
    """Bữa ăn - chứa nhiều foods"""
    name = models.CharField(max_length=100)
    meal_type = models.CharField(max_length=20, choices=MealTime.choices)
    description = models.TextField(blank=True)
    image = CloudinaryField(null=True, blank=True)

    foods = models.ManyToManyField(FoodItem, through='MealFood')
    goal_type = models.CharField(
        max_length=30,
        choices=GoalType.choices,
        blank=True
    )

    class Meta:
        db_table = 'meals'

    def __str__(self):
        return f"{self.name} ({self.meal_type})"


class MealFood(models.Model):
    """Food trong meal với số lượng"""
    meal = models.ForeignKey(Meal, on_delete=models.CASCADE)
    food_item = models.ForeignKey(FoodItem, on_delete=models.CASCADE)
    servings = models.FloatField(default=1.0, help_text="Số phần ăn")
    order = models.IntegerField(default=0)

    class Meta:
        db_table = 'meal_foods'
        ordering = ['order']

    def __str__(self):
        return f"{self.meal.name} - {self.food_item.name}"


class DailyMealPlan(BaseModel):
    """Kế hoạch ăn trong 1 ngày"""
    name = models.CharField(max_length=100, default="My Daily Plan")

    breakfast = models.ForeignKey(
        Meal,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='daily_breakfasts'
    )
    lunch = models.ForeignKey(
        Meal,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='daily_lunches'
    )
    dinner = models.ForeignKey(
        Meal,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='daily_dinners'
    )
    snack = models.ForeignKey(
        Meal,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='daily_snacks'
    )

    goal_type = models.CharField(
        max_length=30,
        choices=GoalType.choices,
        blank=True
    )

    class Meta:
        db_table = 'daily_meal_plans'

    def __str__(self):
        return self.name


class NutritionPlan(BaseModel):
    """Kế hoạch dinh dưỡng của user"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='nutrition_plans')
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)

    # Schedule đơn giản: JSON {day_of_week: daily_meal_plan_id}
    weekly_schedule = models.JSONField(default=dict)

    # Daily targets
    daily_calories_target = models.IntegerField(null=True, blank=True)
    daily_protein_target = models.FloatField(null=True, blank=True)

    is_active = models.BooleanField(default=True)
    assigned_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_nutrition_plans',
        limit_choices_to={'role': UserRole.SPECIALIST}
    )

    class Meta:
        db_table = 'nutrition_plans'

    def __str__(self):
        return f"{self.name} - {self.user.username}"


class MealLog(BaseModel):
    """Log bữa ăn thực tế"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='meal_logs')
    meal = models.ForeignKey(Meal, on_delete=models.SET_NULL, null=True, blank=True)
    date = models.DateField(default=timezone.now)
    meal_type = models.CharField(max_length=20, choices=MealTime.choices)

    calories = models.IntegerField(default=0)
    protein = models.FloatField(default=0)
    carbs = models.FloatField(default=0)
    fat = models.FloatField(default=0)

    notes = models.TextField(blank=True)
    image = CloudinaryField(null=True, blank=True)

    class Meta:
        db_table = 'meal_logs'
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.meal_type} - {self.date}"


# ========================
# NOTIFICATIONS - Đơn giản
# ========================
class Notification(BaseModel):
    """Thông báo cho user"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_read = models.BooleanField(default=False)

    # Type để phân loại
    notification_type = models.CharField(
        max_length=20,
        choices=[
            ('INFO', 'Info'),
            ('REMINDER', 'Reminder'),
            ('ACHIEVEMENT', 'Achievement'),
            ('MESSAGE', 'Message'),
        ],
        default='INFO'
    )

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.title}"


# ========================
# PROGRESS TRACKING
# ========================
class ProgressPhoto(BaseModel):
    """Ảnh tiến độ"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress_photos')
    photo = CloudinaryField()
    date_taken = models.DateField(default=timezone.now)
    weight_at_time = models.FloatField(null=True, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'progress_photos'
        ordering = ['-date_taken']

    def __str__(self):
        return f"{self.user.username} - {self.date_taken}"