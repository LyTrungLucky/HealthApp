from django.db import models
from django.contrib.auth.models import AbstractUser
from ckeditor.fields import RichTextField
from cloudinary.models import CloudinaryField


class User(AbstractUser):
    ROLE_CHOICES = [
        ('user', 'Người dùng'),
        ('nutritionist', 'Chuyên gia dinh dưỡng'),
        ('trainer', 'Huấn luyện viên'),
    ]
    avatar = CloudinaryField(null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    phone = models.CharField(max_length=15, null=True, blank=True)

    def __str__(self):
        return f"{self.username} - {self.get_role_display()}"


class BaseModel(models.Model):
    active = models.BooleanField(default=True)
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class HealthProfile(BaseModel):
    GOAL_CHOICES = [
        ('lose_weight', 'Giảm cân'),
        ('gain_muscle', 'Tăng cơ'),
        ('maintain', 'Duy trì sức khỏe'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='health_profile')
    height = models.FloatField(help_text="Chiều cao (cm)")
    weight = models.FloatField(help_text="Cân nặng (kg)")
    age = models.IntegerField()
    goal = models.CharField(max_length=20, choices=GOAL_CHOICES, default='maintain')
    target_weight = models.FloatField(null=True, blank=True, help_text="Cân nặng mục tiêu (kg)")
    expert = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True,
                               related_name='clients', limit_choices_to={'role__in': ['nutritionist', 'trainer']})

    @property
    def bmi(self):
        height_m = self.height / 100
        return round(self.weight / (height_m ** 2), 2)

    def __str__(self):
        return f"Hồ sơ sức khỏe - {self.user.username}"


class DailyTracking(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='daily_trackings')
    date = models.DateField()
    weight = models.FloatField(null=True, blank=True, help_text="Cân nặng (kg)")
    water_intake = models.IntegerField(default=0, help_text="Lượng nước uống (ml)")
    steps = models.IntegerField(default=0, help_text="Số bước đi")
    heart_rate = models.IntegerField(null=True, blank=True, help_text="Nhịp tim (bpm)")
    notes = models.TextField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'date')
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.date}"


class ExerciseCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(null=True, blank=True)

    class Meta:
        verbose_name_plural = "Exercise Categories"

    def __str__(self):
        return self.name


class Exercise(BaseModel):
    DIFFICULTY_CHOICES = [
        ('easy', 'Dễ'),
        ('medium', 'Trung bình'),
        ('hard', 'Khó'),
    ]

    name = models.CharField(max_length=255)
    description = RichTextField()
    category = models.ForeignKey(ExerciseCategory, on_delete=models.CASCADE)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES, default='medium')
    duration = models.IntegerField(help_text="Thời gian (phút)")
    calories_burned = models.IntegerField(help_text="Calories tiêu hao")
    image = CloudinaryField(null=True, blank=True)
    video_url = models.URLField(null=True, blank=True, help_text="Link video YouTube/Vimeo")
    instructions = models.TextField(help_text="Hướng dẫn thực hiện")

    def __str__(self):
        return self.name


class WorkoutPlan(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_plans')
    name = models.CharField(max_length=255)
    goal = models.CharField(max_length=20, choices=HealthProfile.GOAL_CHOICES)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,
                                   related_name='created_workout_plans')

    def __str__(self):
        return f"{self.name} - {self.user.username}"


class WorkoutSchedule(BaseModel):
    WEEKDAY_CHOICES = [
        (0, 'Thứ 2'),
        (1, 'Thứ 3'),
        (2, 'Thứ 4'),
        (3, 'Thứ 5'),
        (4, 'Thứ 6'),
        (5, 'Thứ 7'),
        (6, 'Chủ nhật'),
    ]

    workout_plan = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE, related_name='schedules')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    weekday = models.IntegerField(choices=WEEKDAY_CHOICES)
    sets = models.IntegerField(default=3)
    reps = models.IntegerField(default=10, help_text="Số lần lặp lại")
    notes = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['weekday']

    def __str__(self):
        return f"{self.workout_plan.name} - {self.get_weekday_display()}"


class Food(BaseModel):
    MEAL_TYPE_CHOICES = [
        ('breakfast', 'Bữa sáng'),
        ('lunch', 'Bữa trưa'),
        ('dinner', 'Bữa tối'),
        ('snack', 'Bữa phụ'),
    ]

    name = models.CharField(max_length=255)
    description = RichTextField(null=True, blank=True)
    image = CloudinaryField(null=True)
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES)
    calories = models.IntegerField(help_text="Calories")
    protein = models.FloatField(help_text="Protein (g)")
    carbs = models.FloatField(help_text="Carbohydrates (g)")
    fat = models.FloatField(help_text="Fat (g)")
    recipe = models.TextField(null=True, blank=True, help_text="Công thức nấu")

    def __str__(self):
        return self.name


class NutritionPlan(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='nutrition_plans')
    name = models.CharField(max_length=255)
    goal = models.CharField(max_length=20, choices=HealthProfile.GOAL_CHOICES)
    description = models.TextField(null=True, blank=True)
    daily_calories = models.IntegerField(help_text="Tổng calories mỗi ngày")
    start_date = models.DateField()
    end_date = models.DateField()
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True,
                                   related_name='created_nutrition_plans')

    def __str__(self):
        return f"{self.name} - {self.user.username}"


class MealSchedule(BaseModel):
    nutrition_plan = models.ForeignKey(NutritionPlan, on_delete=models.CASCADE, related_name='meal_schedules')
    food = models.ForeignKey(Food, on_delete=models.CASCADE)
    weekday = models.IntegerField(choices=WorkoutSchedule.WEEKDAY_CHOICES)
    portion = models.FloatField(default=1.0, help_text="Khẩu phần (1.0 = 1 phần)")
    notes = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['weekday', 'food__meal_type']

    def __str__(self):
        return f"{self.nutrition_plan.name} - {self.get_weekday_display()}"


class Progress(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progress_records')
    date = models.DateField()
    weight = models.FloatField(help_text="Cân nặng (kg)")
    body_fat = models.FloatField(null=True, blank=True, help_text="Tỷ lệ mỡ (%)")
    muscle_mass = models.FloatField(null=True, blank=True, help_text="Khối lượng cơ (kg)")
    photos = CloudinaryField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return f"{self.user.username} - {self.date}"


class Consultation(BaseModel):
    STATUS_CHOICES = [
        ('pending', 'Chờ xác nhận'),
        ('confirmed', 'Đã xác nhận'),
        ('completed', 'Hoàn thành'),
        ('cancelled', 'Đã hủy'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='consultations')
    expert = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expert_consultations',
                               limit_choices_to={'role__in': ['nutritionist', 'trainer']})
    appointment_date = models.DateTimeField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    notes = models.TextField(null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['-appointment_date']

    def __str__(self):
        return f"{self.user.username} - {self.expert.username} ({self.appointment_date})"


class Reminder(BaseModel):
    REMINDER_TYPE_CHOICES = [
        ('water', 'Uống nước'),
        ('exercise', 'Tập luyện'),
        ('rest', 'Nghỉ ngơi'),
        ('meal', 'Bữa ăn'),
        ('medicine', 'Uống thuốc'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reminders')
    title = models.CharField(max_length=255)
    reminder_type = models.CharField(max_length=20, choices=REMINDER_TYPE_CHOICES)
    time = models.TimeField(help_text="Giờ nhắc nhở")
    days_of_week = models.JSONField(default=list, help_text="Các ngày trong tuần [0-6]")
    is_enabled = models.BooleanField(default=True)
    message = models.TextField(null=True, blank=True)

    class Meta:
        ordering = ['time']

    def __str__(self):
        return f"{self.user.username} - {self.title} ({self.time})"


class HealthJournal(BaseModel):
    MOOD_CHOICES = [
        ('great', '😄 Tuyệt vời'),
        ('good', '🙂 Tốt'),
        ('normal', '😐 Bình thường'),
        ('tired', '😓 Mệt mỏi'),
        ('bad', '😢 Không tốt'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='journals')
    date = models.DateField()
    title = models.CharField(max_length=255)
    content = models.TextField()
    mood = models.CharField(max_length=20, choices=MOOD_CHOICES, default='normal')
    workout_completed = models.BooleanField(default=False)
    workout_notes = models.TextField(null=True, blank=True, help_text="Cảm nhận sau buổi tập")
    energy_level = models.IntegerField(default=5, help_text="Mức năng lượng 1-10")
    sleep_hours = models.FloatField(null=True, blank=True, help_text="Số giờ ngủ")
    image = CloudinaryField(null=True, blank=True)

    class Meta:
        ordering = ['-date']
        unique_together = ('user', 'date')

    def __str__(self):
        return f"{self.user.username} - {self.date} - {self.title}"


class ChatRoom(BaseModel):
    """Phòng chat giữa user và expert"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_rooms')
    expert = models.ForeignKey(User, on_delete=models.CASCADE, related_name='expert_chat_rooms',
                               limit_choices_to={'role__in': ['nutritionist', 'trainer']})
    last_message = models.TextField(null=True, blank=True)
    last_message_time = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('user', 'expert')
        ordering = ['-last_message_time']

    def __str__(self):
        return f"{self.user.username} - {self.expert.username}"


class Message(BaseModel):
    """Tin nhắn trong phòng chat"""
    chat_room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    is_read = models.BooleanField(default=False)

    class Meta:
        ordering = ['created_date']

    def __str__(self):
        return f"{self.sender.username}: {self.content[:50]}"



