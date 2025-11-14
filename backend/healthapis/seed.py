from django.utils import timezone
from django.contrib.auth import get_user_model
from health.models import (
    UserProfile, SpecialistProfile, UserSpecialistConnection,
    DailyLog, Exercise, Workout, WorkoutExercise,
    FoodItem, Meal, MealFood,
    DailyMealPlan, NutritionPlan,
    WorkoutPlan, WorkoutLog, MealLog,
    Notification, ProgressPhoto
)
from datetime import date

User = get_user_model()

def run():
    print("=== TẠO DỮ LIỆU MẪU ===")

    # ======================================================
    # USERS
    # ======================================================
    user = User.objects.create_user(
        username="john",
        email="john@example.com",
        password="123456",
        tracking_mode="WITH_SPECIALIST",
        phone="0909000000"
    )

    specialist = User.objects.create_user(
        username="coach_anna",
        email="anna@example.com",
        password="123456",
        role="SPECIALIST",
        phone="0909111122"
    )

    # USER PROFILE
    UserProfile.objects.create(
        user=user,
        height=175,
        weight=72,
        age=25,
        gender="MALE",
        goal_type="WEIGHT_LOSS",
        target_weight=68,
        daily_calories_goal=2000,
    )

    # SPECIALIST PROFILE
    SpecialistProfile.objects.create(
        user=specialist,
        specialization="Nutrition",
        bio="Experienced coach specializing in weight loss programs.",
        experience_years=5,
        rating=4.8
    )

    # USER ↔ SPECIALIST LINK
    UserSpecialistConnection.objects.create(
        user=user,
        specialist=specialist,
        status="ACTIVE",
        notes="Weekly check-in every Friday."
    )

    # ======================================================
    # DAILY LOG SAMPLE
    # ======================================================
    DailyLog.objects.create(
        user=user,
        date=date.today(),
        weight=71.5,
        water_intake=1.5,
        steps_count=8000,
        sleep_hours=7,
        calories_consumed=1800,
        calories_burned=300,
        notes="Feeling good today."
    )

    # ======================================================
    # EXERCISES
    # ======================================================
    squat = Exercise.objects.create(
        name="Squat",
        muscle_group="Legs",
        calories_per_minute=6,
        difficulty="BEGINNER"
    )

    pushup = Exercise.objects.create(
        name="Push-up",
        muscle_group="Chest",
        calories_per_minute=7,
        difficulty="INTERMEDIATE"
    )

    plank = Exercise.objects.create(
        name="Plank",
        muscle_group="Core",
        calories_per_minute=5,
        difficulty="BEGINNER"
    )

    # WORKOUT
    workout = Workout.objects.create(
        name="Full Body Workout",
        description="Basic full body routine",
        goal_type="WEIGHT_LOSS",
        total_duration=30
    )

    # Through table
    WorkoutExercise.objects.create(workout=workout, exercise=squat, order=1, sets=3, reps=12)
    WorkoutExercise.objects.create(workout=workout, exercise=pushup, order=2, sets=3, reps=10)
    WorkoutExercise.objects.create(workout=workout, exercise=plank, order=3, duration_minutes=2)

    # ======================================================
    # FOOD ITEMS
    # ======================================================
    egg = FoodItem.objects.create(
        name="Boiled egg",
        calories=155,
        protein=13,
        carbs=1.1,
        fat=11
    )

    rice = FoodItem.objects.create(
        name="White Rice",
        calories=130,
        protein=2.7,
        carbs=28,
        fat=0.3
    )

    chicken = FoodItem.objects.create(
        name="Grilled Chicken Breast",
        calories=165,
        protein=31,
        carbs=0,
        fat=3.6
    )

    # ======================================================
    # MEALS
    # ======================================================
    breakfast = Meal.objects.create(
        name="Healthy Breakfast",
        meal_type="BREAKFAST",
        goal_type="WEIGHT_LOSS"
    )

    lunch = Meal.objects.create(
        name="Lean Lunch",
        meal_type="LUNCH",
        goal_type="WEIGHT_LOSS"
    )

    MealFood.objects.create(meal=breakfast, food_item=egg, servings=2, order=1)
    MealFood.objects.create(meal=lunch, food_item=rice, servings=1, order=1)
    MealFood.objects.create(meal=lunch, food_item=chicken, servings=1, order=2)

    # ======================================================
    # DAILY MEAL PLAN
    # ======================================================
    daily_meal_plan = DailyMealPlan.objects.create(
        name="Sample Plan",
        breakfast=breakfast,
        lunch=lunch,
        goal_type="WEIGHT_LOSS"
    )

    # ======================================================
    # NUTRITION PLAN
    # ======================================================
    NutritionPlan.objects.create(
        user=user,
        name="Weight Loss Plan",
        description="Lose 4kg in 1 month",
        weekly_schedule={0: daily_meal_plan.id, 2: daily_meal_plan.id, 4: daily_meal_plan.id},
        daily_calories_target=1800,
        daily_protein_target=120,
        assigned_by=specialist,
    )

    # ======================================================
    # WORKOUT PLAN
    # ======================================================
    WorkoutPlan.objects.create(
        user=user,
        name="Fat Burn Routine",
        weekly_schedule={1: workout.id, 3: workout.id, 5: workout.id},
        assigned_by=specialist
    )

    # ======================================================
    # LOGS
    # ======================================================
    WorkoutLog.objects.create(
        user=user,
        workout=workout,
        duration_minutes=35,
        calories_burned=300
    )

    MealLog.objects.create(
        user=user,
        meal=breakfast,
        meal_type="BREAKFAST",
        calories=320,
        protein=20,
        carbs=25,
        fat=12
    )

    # ======================================================
    # NOTIFICATIONS
    # ======================================================
    Notification.objects.create(
        user=user,
        title="Welcome to Health Tracker",
        message="Your specialist Anna is now connected with you!",
        notification_type="INFO"
    )

    Notification.objects.create(
        user=user,
        title="Workout Reminder",
        message="Don't forget your workout today!",
        notification_type="REMINDER"
    )

    # ======================================================
    # PROGRESS PHOTO
    # ======================================================
    ProgressPhoto.objects.create(
        user=user,
        photo="sample_image_url",
        weight_at_time=71.5,
        notes="Starting point"
    )

    print("=== DONE! DỮ LIỆU MẪU ĐÃ TẠO ===")
