from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.html import format_html
from .models import (
    User, UserProfile, SpecialistProfile, UserSpecialistConnection,
    DailyLog, Exercise, Workout, WorkoutExercise, WorkoutPlan, WorkoutLog,
    FoodItem, Meal, MealFood, DailyMealPlan, NutritionPlan, MealLog,
    Notification, ProgressPhoto
)


# ========================
# USER MANAGEMENT
# ========================
@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'tracking_mode', 'is_staff', 'date_joined']
    list_filter = ['role', 'tracking_mode', 'is_staff', 'is_active']
    search_fields = ['username', 'email', 'first_name', 'last_name', 'phone']

    fieldsets = BaseUserAdmin.fieldsets + (
        ('Thông tin bổ sung', {
            'fields': ('avatar', 'role', 'tracking_mode', 'phone')
        }),
    )

    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Thông tin bổ sung', {
            'fields': ('role', 'tracking_mode', 'phone')
        }),
    )


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'age', 'gender', 'height', 'weight', 'display_bmi', 'goal_type']
    list_filter = ['gender', 'goal_type']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['display_bmi', 'created_at', 'updated_at']

    fieldsets = (
        ('Người dùng', {
            'fields': ('user',)
        }),
        ('Thông tin cơ bản', {
            'fields': ('height', 'weight', 'age', 'gender', 'display_bmi')
        }),
        ('Mục tiêu', {
            'fields': ('goal_type', 'target_weight')
        }),
        ('Mục tiêu hàng ngày', {
            'fields': ('daily_water_goal', 'daily_steps_goal', 'daily_calories_goal')
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def display_bmi(self, obj):
        bmi = obj.bmi
        if bmi:
            if bmi < 18.5:
                color = 'orange'
                status = 'Thiếu cân'
            elif 18.5 <= bmi < 25:
                color = 'green'
                status = 'Bình thường'
            elif 25 <= bmi < 30:
                color = 'orange'
                status = 'Thừa cân'
            else:
                color = 'red'
                status = 'Béo phì'
            return format_html(
                '<span style="color: {}; font-weight: bold;">{} ({})</span>',
                color, bmi, status
            )
        return '-'

    display_bmi.short_description = 'BMI'


@admin.register(SpecialistProfile)
class SpecialistProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'specialization', 'experience_years', 'rating', 'created_at']
    list_filter = ['specialization']
    search_fields = ['user__username', 'specialization', 'bio']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(UserSpecialistConnection)
class UserSpecialistConnectionAdmin(admin.ModelAdmin):
    list_display = ['user', 'specialist', 'status', 'created_at']
    list_filter = ['status']
    search_fields = ['user__username', 'specialist__username']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Kết nối', {
            'fields': ('user', 'specialist', 'status')
        }),
        ('Ghi chú', {
            'fields': ('notes',)
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


# ========================
# DAILY TRACKING
# ========================
@admin.register(DailyLog)
class DailyLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'weight', 'water_intake', 'steps_count', 'calories_consumed', 'calories_burned']
    list_filter = ['date']
    search_fields = ['user__username']
    date_hierarchy = 'date'
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Thông tin chung', {
            'fields': ('user', 'date')
        }),
        ('Chỉ số cơ thể', {
            'fields': ('weight',)
        }),
        ('Hoạt động', {
            'fields': ('water_intake', 'steps_count', 'sleep_hours')
        }),
        ('Calories', {
            'fields': ('calories_consumed', 'calories_burned')
        }),
        ('Ghi chú', {
            'fields': ('notes',)
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


# ========================
# EXERCISE & WORKOUT
# ========================
@admin.register(Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['name', 'muscle_group', 'difficulty', 'calories_per_minute', 'created_at']
    list_filter = ['difficulty', 'muscle_group']
    search_fields = ['name', 'description', 'muscle_group']
    readonly_fields = ['created_at', 'updated_at']


class WorkoutExerciseInline(admin.TabularInline):
    model = WorkoutExercise
    extra = 1
    fields = ['exercise', 'order', 'sets', 'reps', 'duration_minutes', 'rest_seconds', 'notes']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['name', 'goal_type', 'total_duration', 'created_at']
    list_filter = ['goal_type']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [WorkoutExerciseInline]

    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('name', 'description', 'goal_type', 'total_duration')
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'is_active', 'assigned_by', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'user__username']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('user', 'name', 'description', 'is_active')
        }),
        ('Lịch tập', {
            'fields': ('weekly_schedule',)
        }),
        ('Phân công', {
            'fields': ('assigned_by',)
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(WorkoutLog)
class WorkoutLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'workout', 'date', 'duration_minutes', 'calories_burned']
    list_filter = ['date']
    search_fields = ['user__username', 'workout__name']
    date_hierarchy = 'date'
    readonly_fields = ['created_at', 'updated_at']


# ========================
# FOOD & NUTRITION
# ========================
@admin.register(FoodItem)
class FoodItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'serving_size', 'calories', 'protein', 'carbs', 'fat']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('name', 'description', 'image')
        }),
        ('Dinh dưỡng (per 100g)', {
            'fields': ('serving_size', 'calories', 'protein', 'carbs', 'fat')
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


class MealFoodInline(admin.TabularInline):
    model = MealFood
    extra = 1
    fields = ['food_item', 'servings', 'order']


@admin.register(Meal)
class MealAdmin(admin.ModelAdmin):
    list_display = ['name', 'meal_type', 'goal_type', 'created_at']
    list_filter = ['meal_type', 'goal_type']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [MealFoodInline]

    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('name', 'meal_type', 'goal_type', 'description', 'image')
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(DailyMealPlan)
class DailyMealPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'goal_type', 'breakfast', 'lunch', 'dinner', 'snack']
    list_filter = ['goal_type']
    search_fields = ['name']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('name', 'goal_type')
        }),
        ('Các bữa ăn', {
            'fields': ('breakfast', 'lunch', 'dinner', 'snack')
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(NutritionPlan)
class NutritionPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'is_active', 'daily_calories_target', 'assigned_by', 'created_at']
    list_filter = ['is_active']
    search_fields = ['name', 'user__username']
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('user', 'name', 'description', 'is_active')
        }),
        ('Lịch ăn', {
            'fields': ('weekly_schedule',)
        }),
        ('Mục tiêu hàng ngày', {
            'fields': ('daily_calories_target', 'daily_protein_target')
        }),
        ('Phân công', {
            'fields': ('assigned_by',)
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(MealLog)
class MealLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'meal_type', 'date', 'calories', 'protein', 'carbs', 'fat']
    list_filter = ['meal_type', 'date']
    search_fields = ['user__username', 'meal__name']
    date_hierarchy = 'date'
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Thông tin chung', {
            'fields': ('user', 'meal', 'date', 'meal_type')
        }),
        ('Dinh dưỡng', {
            'fields': ('calories', 'protein', 'carbs', 'fat')
        }),
        ('Ghi chú', {
            'fields': ('notes', 'image')
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


# ========================
# NOTIFICATIONS & PROGRESS
# ========================
@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'title', 'notification_type', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read', 'created_at']
    search_fields = ['user__username', 'title', 'message']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('user', 'title', 'message', 'notification_type')
        }),
        ('Trạng thái', {
            'fields': ('is_read',)
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    actions = ['mark_as_read', 'mark_as_unread']

    def mark_as_read(self, request, queryset):
        updated = queryset.update(is_read=True)
        self.message_user(request, f'{updated} thông báo đã được đánh dấu là đã đọc.')

    mark_as_read.short_description = 'Đánh dấu là đã đọc'

    def mark_as_unread(self, request, queryset):
        updated = queryset.update(is_read=False)
        self.message_user(request, f'{updated} thông báo đã được đánh dấu là chưa đọc.')

    mark_as_unread.short_description = 'Đánh dấu là chưa đọc'


@admin.register(ProgressPhoto)
class ProgressPhotoAdmin(admin.ModelAdmin):
    list_display = ['user', 'date_taken', 'weight_at_time', 'created_at']
    list_filter = ['date_taken']
    search_fields = ['user__username', 'notes']
    date_hierarchy = 'date_taken'
    readonly_fields = ['created_at', 'updated_at']

    fieldsets = (
        ('Thông tin cơ bản', {
            'fields': ('user', 'photo', 'date_taken', 'weight_at_time')
        }),
        ('Ghi chú', {
            'fields': ('notes',)
        }),
        ('Thời gian', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


# Tùy chỉnh tên site admin
admin.site.site_header = "Health Tracking Admin"
admin.site.site_title = "Health Tracking"
admin.site.index_title = "Quản lý ứng dụng sức khỏe"