from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import (User, HealthProfile, DailyTracking, Exercise, ExerciseCategory,
                     WorkoutPlan, WorkoutSchedule, Food, NutritionPlan, MealSchedule,
                     Progress, Consultation)

class CustomUserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'first_name', 'last_name', 'is_staff']
    list_filter = ['role', 'is_staff', 'is_superuser']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Thông tin bổ sung', {'fields': ('avatar', 'role', 'phone', 'bio')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Thông tin bổ sung', {'fields': ('avatar', 'role', 'phone', 'bio')}),
    )

class HealthProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'height', 'weight', 'bmi', 'age', 'goal', 'expert']
    list_filter = ['goal', 'active']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_date', 'updated_date']

class DailyTrackingAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'weight', 'water_intake', 'steps', 'heart_rate']
    list_filter = ['date']
    search_fields = ['user__username']
    date_hierarchy = 'date'

class ExerciseCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name']

class ExerciseAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'difficulty', 'duration', 'calories_burned', 'active']
    list_filter = ['category', 'difficulty', 'active']
    search_fields = ['name', 'description']
    readonly_fields = ['created_date', 'updated_date']

class WorkoutScheduleInline(admin.TabularInline):
    model = WorkoutSchedule
    extra = 1

class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'goal', 'start_date', 'end_date', 'created_by', 'active']
    list_filter = ['goal', 'active']
    search_fields = ['name', 'user__username']
    inlines = [WorkoutScheduleInline]

class FoodAdmin(admin.ModelAdmin):
    list_display = ['name', 'meal_type', 'calories', 'protein', 'carbs', 'fat', 'active']
    list_filter = ['meal_type', 'active']
    search_fields = ['name', 'description']
    readonly_fields = ['created_date', 'updated_date']

class MealScheduleInline(admin.TabularInline):
    model = MealSchedule
    extra = 1

class NutritionPlanAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'goal', 'daily_calories', 'start_date', 'end_date', 'created_by', 'active']
    list_filter = ['goal', 'active']
    search_fields = ['name', 'user__username']
    inlines = [MealScheduleInline]

class ProgressAdmin(admin.ModelAdmin):
    list_display = ['user', 'date', 'weight', 'body_fat', 'muscle_mass']
    list_filter = ['date']
    search_fields = ['user__username']
    date_hierarchy = 'date'

class ConsultationAdmin(admin.ModelAdmin):
    list_display = ['user', 'expert', 'appointment_date', 'status']
    list_filter = ['status', 'appointment_date']
    search_fields = ['user__username', 'expert__username']
    date_hierarchy = 'appointment_date'

# Register models
admin.site.register(User, CustomUserAdmin)
admin.site.register(HealthProfile, HealthProfileAdmin)
admin.site.register(DailyTracking, DailyTrackingAdmin)
admin.site.register(ExerciseCategory, ExerciseCategoryAdmin)
admin.site.register(Exercise, ExerciseAdmin)
admin.site.register(WorkoutPlan, WorkoutPlanAdmin)
admin.site.register(Food, FoodAdmin)
admin.site.register(NutritionPlan, NutritionPlanAdmin)
admin.site.register(Progress, ProgressAdmin)
admin.site.register(Consultation, ConsultationAdmin)