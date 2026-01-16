from django.core.management.base import BaseCommand
from health.models import (
    User, HealthProfile, DailyTracking,
    ExerciseCategory, Exercise,
    WorkoutPlan, WorkoutSchedule,
    Food, NutritionPlan, MealSchedule,
    Progress, Consultation, Reminder,
    HealthJournal, ChatRoom, Message
)
from django.utils import timezone
from datetime import datetime, timedelta
import random
import json


class Command(BaseCommand):
    help = "Populate database with sample health and fitness data"

    def add_arguments(self, parser):
        parser.add_argument(
            "--clear",
            action="store_true",
            help="Clear existing data before populating",
        )

    def handle(self, *args, **options):
        if options["clear"]:
            self.stdout.write("Clearing existing data...")
            self.clear_data()

        self.stdout.write("Starting data population...")

        # Create users with different roles
        self.stdout.write("Creating users...")
        users, nutritionists, trainers = self.create_users()

        # Create exercise categories
        self.stdout.write("Creating exercise categories...")
        categories = self.create_exercise_categories()

        # Create exercises
        self.stdout.write("Creating exercises...")
        exercises = self.create_exercises(categories)

        # Create workout plans
        self.stdout.write("Creating workout plans...")
        workout_plans = self.create_workout_plans(users, trainers)

        # Create workout schedules
        self.stdout.write("Creating workout schedules...")
        self.create_workout_schedules(workout_plans, exercises)

        # Create foods
        self.stdout.write("Creating foods...")
        foods = self.create_foods()

        # Create nutrition plans
        self.stdout.write("Creating nutrition plans...")
        nutrition_plans = self.create_nutrition_plans(users, nutritionists)

        # Create meal schedules
        self.stdout.write("Creating meal schedules...")
        self.create_meal_schedules(nutrition_plans, foods)

        # Create daily tracking
        self.stdout.write("Creating daily tracking records...")
        self.create_daily_tracking(users)

        # Create progress records
        self.stdout.write("Creating progress records...")
        self.create_progress_records(users)

        # Create consultations
        self.stdout.write("Creating consultations...")
        self.create_consultations(users, nutritionists, trainers)

        # Create reminders
        self.stdout.write("Creating reminders...")
        self.create_reminders(users)

        # Create health journals
        self.stdout.write("Creating health journals...")
        self.create_health_journals(users)

        # Create chat rooms and messages
        self.stdout.write("Creating chat rooms and messages...")
        self.create_chat_rooms_and_messages(users, nutritionists, trainers)

        self.stdout.write(self.style.SUCCESS("Successfully populated database with sample data!"))

    def clear_data(self):
        """Clear all existing data"""
        Message.objects.all().delete()
        ChatRoom.objects.all().delete()
        HealthJournal.objects.all().delete()
        Reminder.objects.all().delete()
        Consultation.objects.all().delete()
        Progress.objects.all().delete()
        DailyTracking.objects.all().delete()
        MealSchedule.objects.all().delete()
        NutritionPlan.objects.all().delete()
        Food.objects.all().delete()
        WorkoutSchedule.objects.all().delete()
        WorkoutPlan.objects.all().delete()
        Exercise.objects.all().delete()
        ExerciseCategory.objects.all().delete()
        HealthProfile.objects.all().delete()
        User.objects.all().delete()

    def create_users(self):
        """Create sample users with different roles: user, nutritionist, trainer"""
        users = []
        nutritionists = []
        trainers = []

        # Regular users
        user_data = [
            {
                "username": "john_doe",
                "email": "john@example.com",
                "first_name": "John",
                "last_name": "Doe",
                "role": "user",
                "profile": {
                    "age": 28,
                    "height": 175.0,
                    "weight": 75.0,
                    "goal": "gain_muscle",
                    "target_weight": 80.0
                }
            },
            {
                "username": "jane_smith",
                "email": "jane@example.com",
                "first_name": "Jane",
                "last_name": "Smith",
                "role": "user",
                "profile": {
                    "age": 25,
                    "height": 165.0,
                    "weight": 60.0,
                    "goal": "lose_weight",
                    "target_weight": 80.0
                }
            },
            {
                "username": "mike_johnson",
                "email": "mike@example.com",
                "first_name": "Mike",
                "last_name": "Johnson",
                "role": "user",
                "profile": {
                    "age": 35,
                    "height": 180.0,
                    "weight": 85.0,
                    "goal": "maintain",
                    "target_weight": 80.0
                }
            },
            {
                "username": "sarah_williams",
                "email": "sarah@example.com",
                "first_name": "Sarah",
                "last_name": "Williams",
                "role": "user",
                "profile": {
                    "age": 30,
                    "height": 170.0,
                    "weight": 65.0,
                    "goal": "gain_muscle",
                    "target_weight": 80.0
                }
            },
            {
                "username": "alex_brown",
                "email": "alex@example.com",
                "first_name": "Alex",
                "last_name": "Brown",
                "role": "user",
                "profile": {
                    "age": 22,
                    "height": 178.0,
                    "weight": 70.0,
                    "goal": "lose_weight",
                    "target_weight": 80.0
                }
            }
        ]

        # Nutritionists
        nutritionist_data = [
            {
                "username": "dr_nutrition",
                "email": "nutrition@example.com",
                "first_name": "Emily",
                "last_name": "Nutrition",
                "role": "nutritionist",
                "profile": {
                    "age": 35,
                    "height": 168.0,
                    "weight": 58.0,
                    "goal": "maintain",
                    "target_weight": 80.0
                }
            },
            {
                "username": "healthy_coach",
                "email": "coach@example.com",
                "first_name": "David",
                "last_name": "Healthy",
                "role": "nutritionist",
                "profile": {
                    "age": 40,
                    "height": 175.0,
                    "weight": 72.0,
                    "goal": "maintain",
                    "target_weight": 80.0
                }
            }
        ]

        # Trainers
        trainer_data = [
            {
                "username": "coach_fit",
                "email": "fit@example.com",
                "first_name": "Robert",
                "last_name": "Fitness",
                "role": "trainer",
                "profile": {
                    "age": 32,
                    "height": 182.0,
                    "weight": 80.0,
                    "goal": "maintain",
                    "target_weight": 80.0
                }
            },
            {
                "username": "trainer_pro",
                "email": "pro@example.com",
                "first_name": "Lisa",
                "last_name": "Strong",
                "role": "trainer",
                "profile": {
                    "age": 28,
                    "height": 172.0,
                    "weight": 62.0,
                    "goal": "maintain",
                    "target_weight": 80.0
                }
            }
        ]

        # Create users
        for data in user_data:
            profile_data = data.pop("profile")
            role = data.pop("role")
            user = User.objects.create_user(
                username=data["username"],
                email=data["email"],
                password="password123",
                first_name=data["first_name"],
                last_name=data["last_name"],
                role=role
            )
            HealthProfile.objects.create(user=user, **profile_data)
            users.append(user)

        # Create nutritionists
        for data in nutritionist_data:
            profile_data = data.pop("profile")
            role = data.pop("role")
            user = User.objects.create_user(
                username=data["username"],
                email=data["email"],
                password="password123",
                first_name=data["first_name"],
                last_name=data["last_name"],
                role=role
            )
            HealthProfile.objects.create(user=user, **profile_data)
            nutritionists.append(user)

        # Create trainers
        for data in trainer_data:
            profile_data = data.pop("profile")
            role = data.pop("role")
            user = User.objects.create_user(
                username=data["username"],
                email=data["email"],
                password="password123",
                first_name=data["first_name"],
                last_name=data["last_name"],
                role=role
            )
            HealthProfile.objects.create(user=user, **profile_data)
            trainers.append(user)

        return users, nutritionists, trainers

    def create_exercise_categories(self):
        """Create exercise categories"""
        categories_data = [
            {"name": "Cardio", "description": "Bài tập tim mạch giúp tăng sức bền và đốt cháy calo"},
            {"name": "Strength", "description": "Bài tập sức mạnh giúp xây dựng cơ bắp"},
            {"name": "Flexibility", "description": "Bài tập co giãn tăng độ linh hoạt"},
            {"name": "Balance", "description": "Bài tập cân bằng và ổn định"},
            {"name": "Core", "description": "Bài tập tăng cường cơ core"},
            {"name": "HIIT", "description": "Bài tập cường độ cao ngắt quãng"},
            {"name": "Yoga", "description": "Bài tập yoga và thiền định"},
            {"name": "Pilates", "description": "Bài tập pilates cho core và độ linh hoạt"},
        ]

        categories = []
        for data in categories_data:
            category, created = ExerciseCategory.objects.get_or_create(**data)
            categories.append(category)

        return categories

    def create_exercises(self, categories):
        """Create sample exercises"""
        exercises_data = [
            # Cardio
            {"name": "Chạy bộ", "category": "Cardio", "description": "Chạy ngoài trời hoặc máy chạy bộ",
             "duration": 30, "calories_burned": 300, "difficulty": "medium"},
            {"name": "Đạp xe", "category": "Cardio", "description": "Đạp xe cố định hoặc ngoài trời",
             "duration": 30, "calories_burned": 240, "difficulty": "easy"},
            {"name": "Nhảy dây", "category": "Cardio", "description": "Nhảy dây đốt cháy calo",
             "duration": 15, "calories_burned": 180, "difficulty": "medium"},
            {"name": "Bơi lội", "category": "Cardio", "description": "Bơi toàn thân",
             "duration": 30, "calories_burned": 330, "difficulty": "medium"},

            # Strength
            {"name": "Chống đẩy", "category": "Strength", "description": "Bài tập chống đẩy cơ bản",
             "duration": 10, "calories_burned": 70, "difficulty": "easy"},
            {"name": "Pull-ups", "category": "Strength", "description": "Kéo xà đơn",
             "duration": 10, "calories_burned": 80, "difficulty": "hard"},
            {"name": "Squat", "category": "Strength", "description": "Gánh tạ hoặc tự trọng",
             "duration": 15, "calories_burned": 120, "difficulty": "easy"},
            {"name": "Deadlift", "category": "Strength", "description": "Nâng tạ đòn",
             "duration": 15, "calories_burned": 135, "difficulty": "hard"},
            {"name": "Bench Press", "category": "Strength", "description": "Đẩy ngực với tạ đòn",
             "duration": 15, "calories_burned": 105, "difficulty": "medium"},
            {"name": "Lunges", "category": "Strength", "description": "Bước dài tập đùi",
             "duration": 10, "calories_burned": 60, "difficulty": "easy"},

            # Core
            {"name": "Plank", "category": "Core", "description": "Nằm sấp chống tay",
             "duration": 5, "calories_burned": 25, "difficulty": "easy"},
            {"name": "Crunches", "category": "Core", "description": "Gập bụng",
             "duration": 10, "calories_burned": 50, "difficulty": "easy"},
            {"name": "Russian Twists", "category": "Core", "description": "Xoay người tập bụng",
             "duration": 10, "calories_burned": 60, "difficulty": "medium"},
            {"name": "Mountain Climbers", "category": "Core", "description": "Leo núi tại chỗ",
             "duration": 10, "calories_burned": 90, "difficulty": "medium"},

            # HIIT
            {"name": "Burpees", "category": "HIIT", "description": "Bài tập toàn thân bùng nổ",
             "duration": 10, "calories_burned": 120, "difficulty": "hard"},
            {"name": "High Knees", "category": "HIIT", "description": "Chạy tại chỗ nâng cao đầu gối",
             "duration": 10, "calories_burned": 100, "difficulty": "medium"},

            # Yoga
            {"name": "Downward Dog", "category": "Yoga", "description": "Tư thế yoga cơ bản",
             "duration": 5, "calories_burned": 15, "difficulty": "easy"},
            {"name": "Warrior Pose", "category": "Yoga", "description": "Tư thế chiến binh",
             "duration": 5, "calories_burned": 15, "difficulty": "easy"},
        ]

        category_dict = {cat.name: cat for cat in categories}
        exercises = []

        for data in exercises_data:
            category_name = data.pop("category")
            exercise, created = Exercise.objects.get_or_create(
                name=data["name"],
                defaults={
                    "category": category_dict[category_name],
                    **data
                }
            )
            exercises.append(exercise)

        return exercises

    def create_workout_plans(self, users, trainers):
        """Create sample workout plans by trainers for users"""
        from datetime import date, timedelta

        workout_plans_data = [
            {
                "name": "Kế hoạch tăng cơ cơ bản",
                "description": "Chương trình tập luyện toàn thân cho người mới bắt đầu muốn tăng cơ (8 tuần)",
                "goal": "gain_muscle",
                "user": users[0] if users else None,
                "created_by": trainers[0] if trainers else None,
                "start_date": date.today(),
                "end_date": date.today() + timedelta(weeks=8)
            },
            {
                "name": "Giảm cân hiệu quả",
                "description": "Chương trình cardio và HIIT để giảm mỡ nhanh chóng (12 tuần)",
                "goal": "lose_weight",
                "user": users[1] if len(users) > 1 else users[0],
                "created_by": trainers[1] if len(trainers) > 1 else trainers[0],
                "start_date": date.today(),
                "end_date": date.today() + timedelta(weeks=12)
            },
            {
                "name": "Duy trì sức khỏe",
                "description": "Chương trình cân bằng để duy trì thể trạng (4 tuần)",
                "goal": "maintain",
                "user": users[2] if len(users) > 2 else users[0],
                "created_by": trainers[0] if trainers else None,
                "start_date": date.today(),
                "end_date": date.today() + timedelta(weeks=4)
            },
            {
                "name": "Tăng sức mạnh nâng cao",
                "description": "Chương trình tập luyện sức mạnh cho người đã có kinh nghiệm (16 tuần)",
                "goal": "gain_muscle",
                "user": users[3] if len(users) > 3 else users[0],
                "created_by": trainers[1] if len(trainers) > 1 else trainers[0],
                "start_date": date.today(),
                "end_date": date.today() + timedelta(weeks=16)
            },
            {
                "name": "HIIT giảm cân nhanh",
                "description": "Chương trình HIIT cường độ cao (4 tuần)",
                "goal": "lose_weight",
                "user": users[4] if len(users) > 4 else users[0],
                "created_by": trainers[0] if trainers else None,
                "start_date": date.today(),
                "end_date": date.today() + timedelta(weeks=4)
            },
            {
                "name": "Yoga & Thư giãn",
                "description": "Chương trình yoga và co giãn để cải thiện sức khỏe tinh thần (8 tuần)",
                "goal": "maintain",
                "user": users[0] if users else None,
                "created_by": trainers[1] if len(trainers) > 1 else trainers[0],
                "start_date": date.today(),
                "end_date": date.today() + timedelta(weeks=8)
            },
        ]

        workout_plans = []
        for data in workout_plans_data:
            plan, created = WorkoutPlan.objects.get_or_create(
                name=data["name"],
                user=data["user"],
                defaults=data
            )
            workout_plans.append(plan)

        return workout_plans

    def create_workout_schedules(self, workout_plans, exercises):
        """Create workout schedules for each plan (weekday-based)"""
        # weekday: 0=Thứ 2, 1=Thứ 3, 2=Thứ 4, 3=Thứ 5, 4=Thứ 6, 5=Thứ 7, 6=Chủ nhật
        weekday_map = {
            "monday": 0,
            "tuesday": 1,
            "wednesday": 2,
            "thursday": 3,
            "friday": 4,
            "saturday": 5,
            "sunday": 6
        }

        exercise_dict = {ex.name: ex for ex in exercises}

        # Mapping workout plans to exercises by weekday
        schedule_mapping = {
            "Kế hoạch tăng cơ cơ bản": {
                "monday": ["Chống đẩy", "Squat", "Plank"],
                "wednesday": ["Bench Press", "Lunges", "Crunches"],
                "friday": ["Pull-ups", "Deadlift", "Russian Twists"],
            },
            "Giảm cân hiệu quả": {
                "monday": ["Chạy bộ", "Burpees", "High Knees"],
                "wednesday": ["Đạp xe", "Nhảy dây", "Mountain Climbers"],
                "friday": ["Bơi lội", "Burpees", "High Knees"],
                "saturday": ["Chạy bộ", "Mountain Climbers"],
            },
            "Duy trì sức khỏe": {
                "tuesday": ["Chạy bộ", "Squat", "Plank"],
                "thursday": ["Đạp xe", "Chống đẩy", "Crunches"],
                "saturday": ["Downward Dog", "Warrior Pose"],
            },
            "Tăng sức mạnh nâng cao": {
                "monday": ["Deadlift", "Bench Press", "Pull-ups"],
                "tuesday": ["Squat", "Lunges", "Russian Twists"],
                "thursday": ["Bench Press", "Deadlift", "Plank"],
                "friday": ["Pull-ups", "Squat", "Mountain Climbers"],
            },
            "HIIT giảm cân nhanh": {
                "monday": ["Burpees", "High Knees", "Mountain Climbers"],
                "wednesday": ["Burpees", "Nhảy dây", "High Knees"],
                "friday": ["High Knees", "Mountain Climbers", "Burpees"],
            },
            "Yoga & Thư giãn": {
                "monday": ["Downward Dog", "Warrior Pose"],
                "wednesday": ["Warrior Pose", "Downward Dog"],
                "friday": ["Downward Dog", "Warrior Pose"],
                "sunday": ["Warrior Pose", "Downward Dog"],
            }
        }

        for plan in workout_plans:
            if plan.name in schedule_mapping:
                for weekday_str, exercise_names in schedule_mapping[plan.name].items():
                    weekday_int = weekday_map[weekday_str]
                    for exercise_name in exercise_names:
                        if exercise_name in exercise_dict:
                            WorkoutSchedule.objects.get_or_create(
                                workout_plan=plan,
                                weekday=weekday_int,
                                exercise=exercise_dict[exercise_name],
                                defaults={
                                    "sets": random.randint(3, 5),
                                    "reps": random.randint(8, 15),
                                }
                            )

    def create_foods(self):
        """Create sample foods with meal_type"""
        foods_data = [
            # Breakfast
            {"name": "Trứng luộc", "meal_type": "breakfast",
             "calories": 78, "protein": 6.0, "carbs": 0.6, "fat": 5.0},
            {"name": "Yến mạch", "meal_type": "breakfast",
             "calories": 389, "protein": 16.9, "carbs": 66.3, "fat": 6.9},
            {"name": "Sữa chua Hy Lạp", "meal_type": "breakfast",
             "calories": 59, "protein": 10.0, "carbs": 3.6, "fat": 0.4},
            {"name": "Bánh mì nguyên cám", "meal_type": "breakfast",
             "calories": 69, "protein": 3.6, "carbs": 11.6, "fat": 0.9},
            {"name": "Chuối", "meal_type": "breakfast",
             "calories": 105, "protein": 1.3, "carbs": 27.0, "fat": 0.4},

            # Lunch
            {"name": "Ức gà nướng", "meal_type": "lunch",
             "calories": 165, "protein": 31.0, "carbs": 0.0, "fat": 3.6},
            {"name": "Cơm gạo lứt", "meal_type": "lunch",
             "calories": 111, "protein": 2.6, "carbs": 23.0, "fat": 0.9},
            {"name": "Súp lơ xanh", "meal_type": "lunch",
             "calories": 34, "protein": 2.8, "carbs": 7.0, "fat": 0.4},
            {"name": "Cà rót", "meal_type": "lunch",
             "calories": 41, "protein": 0.9, "carbs": 10.0, "fat": 0.2},
            {"name": "Rau bina", "meal_type": "lunch",
             "calories": 23, "protein": 2.9, "carbs": 3.6, "fat": 0.4},

            # Dinner
            {"name": "Cá hồi nướng", "meal_type": "dinner",
             "calories": 208, "protein": 20.0, "carbs": 0.0, "fat": 13.0},
            {"name": "Khoai lang", "meal_type": "dinner",
             "calories": 86, "protein": 1.6, "carbs": 20.0, "fat": 0.1},
            {"name": "Đậu phụ", "meal_type": "dinner",
             "calories": 76, "protein": 8.0, "carbs": 1.9, "fat": 4.8},
            {"name": "Quinoa", "meal_type": "dinner",
             "calories": 120, "protein": 4.4, "carbs": 21.3, "fat": 1.92},
            {"name": "Ớt chuông", "meal_type": "dinner",
             "calories": 31, "protein": 1.0, "carbs": 6.0, "fat": 0.3},

            # Snacks
            {"name": "Hạnh nhân", "meal_type": "snack",
             "calories": 164, "protein": 6.0, "carbs": 6.0, "fat": 14.0},
            {"name": "Táo", "meal_type": "snack",
             "calories": 95, "protein": 0.5, "carbs": 25.0, "fat": 0.3},
            {"name": "Quả việt quất", "meal_type": "snack",
             "calories": 57, "protein": 0.7, "carbs": 14.5, "fat": 0.3},
            {"name": "Bơ", "meal_type": "snack",
             "calories": 160, "protein": 2.0, "carbs": 8.5, "fat": 14.7},
            {"name": "Dầu ô liu", "meal_type": "snack",
             "calories": 119, "protein": 0.0, "carbs": 0.0, "fat": 13.5},
        ]

        foods = []
        for data in foods_data:
            food, created = Food.objects.get_or_create(
                name=data["name"],
                defaults=data
            )
            foods.append(food)

        return foods

    def create_nutrition_plans(self, users, nutritionists):
        """Create sample nutrition plans by nutritionists for users"""
        from datetime import date, timedelta

        plans_data = [
            {
                "name": "Kế hoạch tăng cơ",
                "description": "Thực đơn giàu protein cho người tập gym tăng cơ",
                "goal": "gain_muscle",
                "daily_calories": 2500,
                "user": users[0] if users else None,
                "created_by": nutritionists[0] if nutritionists else None,
                "start_date": date.today(),
                "end_date": date.today() + timedelta(weeks=8)
            },
            {
                "name": "Kế hoạch giảm cân",
                "description": "Thực đơn ít calo để giảm cân hiệu quả",
                "goal": "lose_weight",
                "daily_calories": 1500,
                "user": users[1] if len(users) > 1 else users[0],
                "created_by": nutritionists[1] if len(nutritionists) > 1 else nutritionists[0],
                "start_date": date.today(),
                "end_date": date.today() + timedelta(weeks=12)
            },
            {
                "name": "Kế hoạch duy trì",
                "description": "Thực đơn cân bằng để duy trì cân nặng",
                "goal": "maintain",
                "daily_calories": 2000,
                "user": users[2] if len(users) > 2 else users[0],
                "created_by": nutritionists[0] if nutritionists else None,
                "start_date": date.today(),
                "end_date": date.today() + timedelta(weeks=8)
            },
            {
                "name": "Thực đơn Eat Clean",
                "description": "Thực đơn sạch cho sức khỏe tổng thể",
                "goal": "maintain",
                "daily_calories": 1800,
                "user": users[3] if len(users) > 3 else users[0],
                "created_by": nutritionists[1] if len(nutritionists) > 1 else nutritionists[0],
                "start_date": date.today(),
                "end_date": date.today() + timedelta(weeks=8)
            },
        ]

        nutrition_plans = []
        for data in plans_data:
            plan, created = NutritionPlan.objects.get_or_create(
                name=data["name"],
                user=data["user"],
                defaults=data
            )
            nutrition_plans.append(plan)

        return nutrition_plans

    def create_meal_schedules(self, nutrition_plans, foods):
        """Create meal schedules for nutrition plans"""
        food_dict = {f.name: f for f in foods}

        # Mapping nutrition plans to foods for each weekday
        # weekday: 0-6 (Thứ 2 đến Chủ nhật)
        meal_mapping = {
            "Kế hoạch tăng cơ": {
                0: ["Yến mạch", "Trứng luộc", "Ức gà nướng", "Cơm gạo lứt", "Cá hồi nướng"],
                1: ["Trứng luộc", "Chuối", "Ức gà nướng", "Súp lơ xanh", "Khoai lang"],
                2: ["Yến mạch", "Chuối", "Cơm gạo lứt", "Cà rót", "Cá hồi nướng"],
                3: ["Trứng luộc", "Ức gà nướng", "Cơm gạo lứt", "Khoai lang", "Hạnh nhân"],
                4: ["Yến mạch", "Chuối", "Ức gà nướng", "Súp lơ xanh", "Cá hồi nướng"],
                5: ["Trứng luộc", "Cơm gạo lứt", "Cà rót", "Khoai lang", "Bơ"],
                6: ["Yến mạch", "Ức gà nướng", "Cá hồi nướng", "Ớt chuông", "Hạnh nhân"]
            },
            "Kế hoạch giảm cân": {
                0: ["Yến mạch", "Chuối", "Ức gà nướng", "Rau bina", "Đậu phụ"],
                1: ["Yến mạch", "Ức gà nướng", "Cà rót", "Quinoa", "Táo"],
                2: ["Chuối", "Ức gà nướng", "Rau bina", "Đậu phụ", "Quả việt quất"],
                3: ["Yến mạch", "Rau bina", "Cà rót", "Quinoa", "Táo"],
                4: ["Chuối", "Ức gà nướng", "Đậu phụ", "Súp lơ xanh", "Quả việt quất"],
                5: ["Yến mạch", "Ức gà nướng", "Rau bina", "Quinoa", "Táo"],
                6: ["Chuối", "Đậu phụ", "Súp lơ xanh", "Quả việt quất"]
            },
            "Kế hoạch duy trì": {
                0: ["Trứng luộc", "Bánh mì nguyên cám", "Ức gà nướng", "Cơm gạo lứt", "Cá hồi nướng"],
                1: ["Trứng luộc", "Chuối", "Cơm gạo lứt", "Rau bina", "Khoai lang"],
                2: ["Bánh mì nguyên cám", "Ức gà nướng", "Cơm gạo lứt", "Cá hồi nướng", "Hạnh nhân"],
                3: ["Trứng luộc", "Chuối", "Rau bina", "Khoai lang", "Táo"],
                4: ["Bánh mì nguyên cám", "Ức gà nướng", "Cơm gạo lứt", "Súp lơ xanh", "Cá hồi nướng"],
                5: ["Trứng luộc", "Chuối", "Rau bina", "Khoai lang", "Hạnh nhân"],
                6: ["Ức gà nướng", "Cá hồi nướng", "Súp lơ xanh", "Táo"]
            },
            "Thực đơn Eat Clean": {
                0: ["Yến mạch", "Sữa chua Hy Lạp", "Ức gà nướng", "Quinoa", "Đậu phụ"],
                1: ["Sữa chua Hy Lạp", "Quả việt quất", "Quinoa", "Rau bina", "Khoai lang"],
                2: ["Yến mạch", "Ức gà nướng", "Quinoa", "Cà rót", "Đậu phụ"],
                3: ["Sữa chua Hy Lạp", "Quả việt quất", "Rau bina", "Khoai lang", "Hạnh nhân"],
                4: ["Yến mạch", "Ức gà nướng", "Quinoa", "Cà rót", "Ớt chuông"],
                5: ["Sữa chua Hy Lạp", "Đậu phụ", "Rau bina", "Khoai lang", "Táo"],
                6: ["Yến mạch", "Quả việt quất", "Quinoa", "Ớt chuông", "Hạnh nhân"]
            }
        }

        for plan in nutrition_plans:
            if plan.name in meal_mapping:
                for weekday, food_names in meal_mapping[plan.name].items():
                    for food_name in food_names:
                        if food_name in food_dict:
                            MealSchedule.objects.get_or_create(
                                nutrition_plan=plan,
                                weekday=weekday,
                                food=food_dict[food_name],
                                defaults={
                                    "portion": round(random.uniform(0.8, 1.5), 1)
                                }
                            )

    def create_daily_tracking(self, users):
        """Create daily tracking records for users"""
        for user in users:
            # Create tracking for the past 30 days
            for i in range(30):
                date = timezone.now().date() - timedelta(days=i)
                base_weight = user.health_profile.weight

                DailyTracking.objects.create(
                    user=user,
                    date=date,
                    weight=round(base_weight + random.uniform(-0.5, 0.5), 1),
                    water_intake=random.randint(1500, 3000),
                    steps=random.randint(3000, 15000),
                    heart_rate=random.randint(60, 90),
                )

    def create_progress_records(self, users):
        """Create progress records for users"""
        for user in users:
            # Create progress records for the past 90 days (weekly)
            for i in range(0, 90, 7):
                date = timezone.now().date() - timedelta(days=i)
                base_weight = user.health_profile.weight

                Progress.objects.create(
                    user=user,
                    date=date,
                    weight=round(base_weight + random.uniform(-2.0, 2.0), 1),
                    body_fat=round(random.uniform(15.0, 25.0), 1),
                    muscle_mass=round(random.uniform(30.0, 45.0), 1),
                    notes=random.choice([
                        "Cảm thấy khỏe hơn",
                        "Đang tiến bộ tốt",
                        "Cần cố gắng thêm",
                        "Rất hài lòng với kết quả",
                        ""
                    ])
                )

    def create_consultations(self, users, nutritionists, trainers):
        """Create consultation appointments"""
        experts = nutritionists + trainers

        for user in users:
            # Create 2-4 consultations per user
            for _ in range(random.randint(2, 4)):
                expert = random.choice(experts)
                days_offset = random.randint(-30, 30)
                appointment_date = timezone.now() + timedelta(days=days_offset)

                status = "pending" if days_offset > 0 else random.choice(["confirmed", "confirmed", "cancelled"])

                Consultation.objects.create(
                    user=user,
                    expert=expert,
                    appointment_date=appointment_date,
                    status=status,
                    notes=random.choice([
                        "Tư vấn chế độ ăn uống",
                        "Điều chỉnh kế hoạch tập luyện",
                        "Kiểm tra tiến độ",
                        "Tư vấn bổ sung dinh dưỡng",
                        ""
                    ]) if status == "confirmed" else "",
                    feedback=random.choice([
                        "Rất hữu ích",
                        "Chuyên gia tận tình",
                        "Nhận được nhiều lời khuyên hữu ích",
                        ""
                    ]) if status == "confirmed" else ""
                )

    def create_reminders(self, users):
        """Create reminders for users"""
        from datetime import time

        reminder_data = [
            ("Uống nước đủ", "water", "Nhớ uống đủ 2 lít nước mỗi ngày", [0, 1, 2, 3, 4, 5, 6]),
            ("Tập luyện buổi sáng", "exercise", "Đến giờ tập luyện rồi!", [0, 2, 4]),
            ("Tập luyện buổi tối", "exercise", "Đừng quên tập thể dục nhé!", [1, 3, 5]),
            ("Ăn bữa phụ", "meal", "Đã đến giờ ăn bữa phụ", [0, 1, 2, 3, 4]),
            ("Nghỉ ngơi", "rest", "Hãy nghỉ ngơi và thư giãn", [6]),
            ("Uống thuốc", "medicine", "Nhớ uống thuốc theo đơn", [0, 1, 2, 3, 4, 5, 6]),
        ]

        for user in users:
            # Create 3-5 reminders per user
            for _ in range(random.randint(3, 5)):
                title, reminder_type, message, days = random.choice(reminder_data)

                Reminder.objects.create(
                    user=user,
                    title=title,
                    reminder_type=reminder_type,
                    message=message,
                    time=time(
                        hour=random.randint(6, 21),
                        minute=random.choice([0, 15, 30, 45])
                    ),
                    days_of_week=days,
                    is_enabled=random.choice([True, True, True, False])
                )

    def create_health_journals(self, users):
        """Create health journal entries"""
        moods = ["great", "good", "normal", "tired", "bad"]

        for user in users:
            # Create 10-20 journal entries per user for different dates
            num_entries = random.randint(10, 20)
            # Generate unique dates for this user
            dates_used = set()
            for _ in range(num_entries):
                # Try to find a unique date
                attempts = 0
                while attempts < 100:
                    days_ago = random.randint(0, 60)
                    entry_date = (timezone.now() - timedelta(days=days_ago)).date()
                    if entry_date not in dates_used:
                        dates_used.add(entry_date)
                        break
                    attempts += 1

                if attempts >= 100:
                    continue  # Skip if can't find unique date

                HealthJournal.objects.get_or_create(
                    user=user,
                    date=entry_date,
                    defaults={
                        "title": random.choice([
                            "Ngày tập luyện tốt",
                            "Cảm thấy mệt mỏi",
                            "Tiến bộ rõ rệt",
                            "Ngày bình thường",
                            "Cần điều chỉnh kế hoạch"
                        ]),
                        "content": random.choice([
                            "Hôm nay tập luyện rất tốt!",
                            "Cảm thấy mệt mỏi sau ngày làm việc",
                            "Ăn uống lành mạnh cả ngày",
                            "Đạt được mục tiêu bước đi hôm nay",
                            "Cần nghỉ ngơi nhiều hơn",
                            "Rất hài lòng với tiến độ của mình",
                            "Ngủ không đủ giấc",
                            "Tâm trạng tốt, năng lượng dồi dào",
                        ]),
                        "mood": random.choice(moods),
                        "workout_completed": random.choice([True, False]),
                        "workout_notes": random.choice([
                            "Hoàn thành tốt",
                            "Hơi vất vả",
                            "Cần cải thiện kỹ thuật",
                            ""
                        ]) if random.choice([True, False]) else "",
                        "energy_level": random.randint(1, 10),
                        "sleep_hours": round(random.uniform(5.5, 9.0), 1)
                    }
                )

    def create_chat_rooms_and_messages(self, users, nutritionists, trainers):
        """Create chat rooms and messages between users and experts"""
        experts = nutritionists + trainers

        for user in users:
            # Each user has 1-2 chat rooms with experts
            num_chats = random.randint(1, 2)
            selected_experts = random.sample(experts, min(num_chats, len(experts)))

            for expert in selected_experts:
                chat_room = ChatRoom.objects.create(
                    user=user,
                    expert=expert
                )

                # Create 5-15 messages in each chat room
                num_messages = random.randint(5, 15)
                for i in range(num_messages):
                    is_from_user = i % 2 == 0

                    if is_from_user:
                        message_texts = [
                            "Chào anh/chị, em cần tư vấn về chế độ tập luyện",
                            "Em đã làm theo hướng dẫn và thấy hiệu quả rõ rệt",
                            "Tuần này em bị bận nên chưa tập được nhiều",
                            "Em muốn hỏi về chế độ ăn uống phù hợp",
                            "Cảm ơn anh/chị rất nhiều!",
                            "Em đã đạt được mục tiêu giảm 2kg rồi ạ",
                            "Bài tập hôm qua hơi khó với em",
                        ]
                    else:
                        message_texts = [
                            "Chào em, anh/chị sẵn sàng tư vấn cho em",
                            "Tuyệt vời! Hãy tiếp tục nỗ lực nhé",
                            "Không sao, em cứ tập theo khả năng của mình",
                            "Anh/chị sẽ gửi cho em thực đơn phù hợp",
                            "Rất vui khi được hỗ trợ em!",
                            "Chúc mừng em! Đó là kết quả đáng khích lệ",
                            "Em hãy giảm độ khó xuống một chút, từ từ sẽ quen",
                        ]

                    Message.objects.create(
                        chat_room=chat_room,
                        sender=user if is_from_user else expert,
                        content=random.choice(message_texts)
                    )
