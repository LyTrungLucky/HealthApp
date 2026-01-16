# health/management/commands/populate_data.py
from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from health.models import (
    HealthProfile, ExerciseCategory, Exercise, Food,
    WorkoutPlan, WorkoutSchedule, NutritionPlan, MealSchedule
)
from datetime import date, timedelta

User = get_user_model()


class Command(BaseCommand):
    help = 'Populate database with sample data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample data...')

        # 1. Create Users
        self.create_users()

        # 2. Create Exercise Categories & Exercises
        self.create_exercises()

        # 3. Create Foods
        self.create_foods()

        # 4. Create Health Profiles
        self.create_health_profiles()

        # 5. Create Workout Plans
        self.create_workout_plans()

        # 6. Create Nutrition Plans
        self.create_nutrition_plans()

        self.stdout.write(self.style.SUCCESS('Successfully populated database!'))

    def create_users(self):
        # Admin
        if not User.objects.filter(username='admin').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@health.com',
                password='admin123',
                first_name='Admin',
                last_name='System'
            )

        # Regular Users
        users_data = [
            {'username': 'john_doe', 'first_name': 'John', 'last_name': 'Doe', 'role': 'user',
             'email': 'john@example.com'},
            {'username': 'jane_smith', 'first_name': 'Jane', 'last_name': 'Smith', 'role': 'user',
             'email': 'jane@example.com'},
            {'username': 'mike_wilson', 'first_name': 'Mike', 'last_name': 'Wilson', 'role': 'user',
             'email': 'mike@example.com'},
        ]

        for data in users_data:
            if not User.objects.filter(username=data['username']).exists():
                User.objects.create_user(
                    password='password123',
                    **data
                )

        # Experts
        experts_data = [
            {'username': 'dr_nutrition', 'first_name': 'Dr. Sarah', 'last_name': 'Johnson', 'role': 'nutritionist',
             'email': 'sarah@health.com'},
            {'username': 'coach_fit', 'first_name': 'Coach Tom', 'last_name': 'Anderson', 'role': 'trainer',
             'email': 'tom@health.com'},
        ]

        for data in experts_data:
            if not User.objects.filter(username=data['username']).exists():
                User.objects.create_user(
                    password='password123',
                    **data
                )

        self.stdout.write('✓ Created users')

    def create_exercises(self):
        # Categories
        categories_data = [
            {'name': 'Cardio', 'description': 'Bài tập tim mạch'},
            {'name': 'Strength', 'description': 'Bài tập sức mạnh'},
            {'name': 'Yoga', 'description': 'Bài tập Yoga'},
            {'name': 'HIIT', 'description': 'Bài tập cường độ cao'},
            {'name': 'Flexibility', 'description': 'Bài tập dẻo dai'},
        ]

        for data in categories_data:
            ExerciseCategory.objects.get_or_create(**data)

        # Exercises
        exercises_data = [
            # Cardio
            {
                'name': 'Chạy bộ',
                'description': 'Chạy bộ trên máy hoặc ngoài trời với tốc độ vừa phải',
                'category': ExerciseCategory.objects.get(name='Cardio'),
                'difficulty': 'easy',
                'duration': 30,
                'calories_burned': 300,
                'instructions': '1. Khởi động 5 phút\n2. Chạy đều 20 phút\n3. Hạ nhịp 5 phút'
            },
            {
                'name': 'Đạp xe',
                'description': 'Đạp xe trên máy hoặc ngoài trời',
                'category': ExerciseCategory.objects.get(name='Cardio'),
                'difficulty': 'easy',
                'duration': 45,
                'calories_burned': 400,
                'instructions': '1. Khởi động 5 phút\n2. Đạp đều 35 phút\n3. Hạ nhịp 5 phút'
            },
            {
                'name': 'Nhảy dây',
                'description': 'Nhảy dây tốc độ cao để đốt cháy calo',
                'category': ExerciseCategory.objects.get(name='Cardio'),
                'difficulty': 'medium',
                'duration': 20,
                'calories_burned': 250,
                'instructions': '1. Khởi động cổ chân\n2. Nhảy 30 giây, nghỉ 10 giây\n3. Lặp lại 20 phút'
            },

            # Strength
            {
                'name': 'Push-up (Chống đẩy)',
                'description': 'Bài tập tăng cường sức mạnh cơ ngực và tay',
                'category': ExerciseCategory.objects.get(name='Strength'),
                'difficulty': 'medium',
                'duration': 15,
                'calories_burned': 100,
                'instructions': '1. Nằm sấp, đặt tay rộng bằng vai\n2. Đẩy người lên xuống\n3. 3 sets x 15 reps'
            },
            {
                'name': 'Squat (Gánh tạ)',
                'description': 'Bài tập chân và mông hiệu quả',
                'category': ExerciseCategory.objects.get(name='Strength'),
                'difficulty': 'medium',
                'duration': 20,
                'calories_burned': 150,
                'instructions': '1. Đứng thẳng, chân rộng bằng vai\n2. Hạ người xuống như ngồi ghế\n3. 3 sets x 20 reps'
            },
            {
                'name': 'Plank',
                'description': 'Bài tập tăng cường cơ core',
                'category': ExerciseCategory.objects.get(name='Strength'),
                'difficulty': 'easy',
                'duration': 10,
                'calories_burned': 50,
                'instructions': '1. Chống tay hoặc khuỷu tay\n2. Giữ thẳng người\n3. Giữ 60 giây x 3 sets'
            },
            {
                'name': 'Lunges',
                'description': 'Bài tập chân đơn hiệu quả',
                'category': ExerciseCategory.objects.get(name='Strength'),
                'difficulty': 'medium',
                'duration': 15,
                'calories_burned': 120,
                'instructions': '1. Bước chân về phía trước\n2. Hạ người xuống\n3. 3 sets x 12 reps mỗi chân'
            },

            # HIIT
            {
                'name': 'Burpees',
                'description': 'Bài tập toàn thân cường độ cao',
                'category': ExerciseCategory.objects.get(name='HIIT'),
                'difficulty': 'hard',
                'duration': 15,
                'calories_burned': 200,
                'instructions': '1. Đứng thẳng\n2. Hạ xuống chống đẩy\n3. Nhảy lên cao\n4. 3 sets x 10 reps'
            },
            {
                'name': 'Mountain Climbers',
                'description': 'Bài tập leo núi tại chỗ',
                'category': ExerciseCategory.objects.get(name='HIIT'),
                'difficulty': 'hard',
                'duration': 10,
                'calories_burned': 150,
                'instructions': '1. Tư thế chống đẩy\n2. Kéo chân lên ngực xen kẽ\n3. 30 giây x 4 sets'
            },

            # Yoga
            {
                'name': 'Sun Salutation (Chào mặt trời)',
                'description': 'Chuỗi động tác yoga cơ bản',
                'category': ExerciseCategory.objects.get(name='Yoga'),
                'difficulty': 'easy',
                'duration': 20,
                'calories_burned': 80,
                'instructions': '1. 12 động tác liên tiếp\n2. Thở đều\n3. Lặp lại 5 lần'
            },
            {
                'name': 'Warrior Pose',
                'description': 'Tư thế chiến binh',
                'category': ExerciseCategory.objects.get(name='Yoga'),
                'difficulty': 'medium',
                'duration': 15,
                'calories_burned': 60,
                'instructions': '1. Duỗi thẳng tay\n2. Chân trước gập 90 độ\n3. Giữ 30 giây mỗi bên'
            },
        ]

        for data in exercises_data:
            Exercise.objects.get_or_create(**data)

        self.stdout.write('✓ Created exercises')

    def create_foods(self):
        foods_data = [
            # Breakfast
            {
                'name': 'Yến mạch sữa chua',
                'description': 'Yến mạch nguyên hạt kết hợp với sữa chua Hy Lạp và trái cây',
                'meal_type': 'breakfast',
                'calories': 350,
                'protein': 15,
                'carbs': 50,
                'fat': 8,
                'recipe': '1. 50g yến mạch\n2. 150ml sữa chua\n3. Chuối, dâu tây\n4. 1 thìa mật ong'
            },
            {
                'name': 'Trứng chiên rau củ',
                'description': '2 quả trứng chiên với rau củ xào',
                'meal_type': 'breakfast',
                'calories': 280,
                'protein': 18,
                'carbs': 12,
                'fat': 16,
                'recipe': '1. 2 quả trứng\n2. Cà chua, hành tây, ớt chuông\n3. Ít dầu olive'
            },
            {
                'name': 'Bánh mì nguyên cám bơ trứng',
                'description': 'Bánh mì nguyên cám với bơ và trứng luộc',
                'meal_type': 'breakfast',
                'calories': 320,
                'protein': 14,
                'carbs': 38,
                'fat': 12,
                'recipe': '1. 2 lát bánh mì nguyên cám\n2. 1/4 quả bơ\n3. 1 quả trứng luộc'
            },

            # Lunch
            {
                'name': 'Cơm gạo lứt gà nướng',
                'description': 'Cơm gạo lứt với ức gà nướng và rau xanh',
                'meal_type': 'lunch',
                'calories': 480,
                'protein': 35,
                'carbs': 55,
                'fat': 10,
                'recipe': '1. 150g cơm gạo lứt\n2. 120g ức gà nướng\n3. Rau xà lách, cà chua, dưa leo\n4. Nước sốt mè rang'
            },
            {
                'name': 'Bún cá hồi',
                'description': 'Bún với cá hồi nướng và rau thơm',
                'meal_type': 'lunch',
                'calories': 520,
                'protein': 32,
                'carbs': 62,
                'fat': 14,
                'recipe': '1. 150g bún\n2. 130g cá hồi nướng\n3. Rau thơm, bắp cải, cà rót\n4. Nước mắm pha'
            },
            {
                'name': 'Salad ức gà quinoa',
                'description': 'Salad dinh dưỡng với ức gà và quinoa',
                'meal_type': 'lunch',
                'calories': 420,
                'protein': 30,
                'carbs': 42,
                'fat': 12,
                'recipe': '1. 80g quinoa nấu chín\n2. 100g ức gà luộc\n3. Rau xà lách, cà chua bi, dưa leo\n4. Nước sốt dầu olive chanh'
            },

            # Dinner
            {
                'name': 'Cá thu nướng rau củ',
                'description': 'Cá thu nướng với rau củ hấp',
                'meal_type': 'dinner',
                'calories': 380,
                'protein': 32,
                'carbs': 28,
                'fat': 14,
                'recipe': '1. 150g cá thu\n2. Súp lơ, cà rốt, đậu Hà Lan hấp\n3. Khoai lang luộc'
            },
            {
                'name': 'Tôm xào bông cải xanh',
                'description': 'Tôm xào với bông cải xanh và gạo lứt',
                'meal_type': 'dinner',
                'calories': 360,
                'protein': 28,
                'carbs': 45,
                'fat': 8,
                'recipe': '1. 120g tôm\n2. 200g bông cải xanh\n3. 100g cơm gạo lứt\n4. Tỏi, gừng'
            },
            {
                'name': 'Súp gà nấm',
                'description': 'Súp gà với nấm và rau củ',
                'meal_type': 'dinner',
                'calories': 280,
                'protein': 24,
                'carbs': 32,
                'fat': 6,
                'recipe': '1. 100g ức gà\n2. Nấm, cà rốt, hành tây\n3. Rau cần\n4. Tiêu, muối'
            },

            # Snacks
            {
                'name': 'Chuối đậu phộng',
                'description': 'Chuối với bơ đậu phộng',
                'meal_type': 'snack',
                'calories': 200,
                'protein': 6,
                'carbs': 30,
                'fat': 8,
                'recipe': '1. 1 quả chuối\n2. 1 thìa bơ đậu phộng'
            },
            {
                'name': 'Hạnh nhân sữa chua',
                'description': 'Sữa chua Hy Lạp với hạnh nhân',
                'meal_type': 'snack',
                'calories': 180,
                'protein': 12,
                'carbs': 15,
                'fat': 8,
                'recipe': '1. 150g sữa chua Hy Lạp\n2. 15g hạnh nhân\n3. Ít mật ong'
            },
            {
                'name': 'Táo hạt điều',
                'description': 'Táo cắt lát với hạt điều',
                'meal_type': 'snack',
                'calories': 160,
                'protein': 4,
                'carbs': 22,
                'fat': 7,
                'recipe': '1. 1 quả táo\n2. 10 hạt điều'
            },
        ]

        for data in foods_data:
            Food.objects.get_or_create(**data)

        self.stdout.write('✓ Created foods')

    def create_health_profiles(self):
        users = User.objects.filter(role='user')
        trainer = User.objects.filter(role='trainer').first()
        nutritionist = User.objects.filter(role='nutritionist').first()

        profiles_data = [
            {
                'user': users[0],
                'height': 170,
                'weight': 75,
                'age': 28,
                'goal': 'lose_weight',
                'target_weight': 68,
                'expert': trainer
            },
            {
                'user': users[1],
                'height': 165,
                'weight': 55,
                'age': 25,
                'goal': 'gain_muscle',
                'target_weight': 60,
                'expert': nutritionist
            },
            {
                'user': users[2],
                'height': 178,
                'weight': 72,
                'age': 30,
                'goal': 'maintain',
                'target_weight': 72,
                'expert': trainer
            },
        ]

        for data in profiles_data:
            HealthProfile.objects.get_or_create(**data)

        self.stdout.write('✓ Created health profiles')

    def create_workout_plans(self):
        users = User.objects.filter(role='user')
        trainer = User.objects.filter(role='trainer').first()

        # Plan 1: Giảm cân
        plan1, _ = WorkoutPlan.objects.get_or_create(
            user=users[0],
            name='Kế hoạch giảm cân 4 tuần',
            goal='lose_weight',
            description='Kế hoạch tập luyện giúp giảm cân hiệu quả với cardio và HIIT',
            start_date=date.today(),
            end_date=date.today() + timedelta(days=28),
            created_by=trainer
        )

        # Schedules for Plan 1
        schedules_plan1 = [
            {'exercise': Exercise.objects.get(name='Chạy bộ'), 'weekday': 0, 'sets': 1, 'reps': 1},
            {'exercise': Exercise.objects.get(name='Burpees'), 'weekday': 0, 'sets': 3, 'reps': 10},
            {'exercise': Exercise.objects.get(name='Nhảy dây'), 'weekday': 2, 'sets': 1, 'reps': 1},
            {'exercise': Exercise.objects.get(name='Mountain Climbers'), 'weekday': 2, 'sets': 4, 'reps': 15},
            {'exercise': Exercise.objects.get(name='Đạp xe'), 'weekday': 4, 'sets': 1, 'reps': 1},
            {'exercise': Exercise.objects.get(name='Plank'), 'weekday': 4, 'sets': 3, 'reps': 1},
        ]

        for sched in schedules_plan1:
            WorkoutSchedule.objects.get_or_create(
                workout_plan=plan1,
                **sched
            )

        # Plan 2: Tăng cơ
        plan2, _ = WorkoutPlan.objects.get_or_create(
            user=users[1],
            name='Kế hoạch tăng cơ 6 tuần',
            goal='gain_muscle',
            description='Kế hoạch tập luyện tăng cường sức mạnh và khối lượng cơ',
            start_date=date.today(),
            end_date=date.today() + timedelta(days=42),
            created_by=trainer
        )

        schedules_plan2 = [
            {'exercise': Exercise.objects.get(name='Push-up (Chống đẩy)'), 'weekday': 0, 'sets': 4, 'reps': 15},
            {'exercise': Exercise.objects.get(name='Squat (Gánh tạ)'), 'weekday': 0, 'sets': 4, 'reps': 20},
            {'exercise': Exercise.objects.get(name='Lunges'), 'weekday': 2, 'sets': 3, 'reps': 12},
            {'exercise': Exercise.objects.get(name='Plank'), 'weekday': 2, 'sets': 3, 'reps': 1},
            {'exercise': Exercise.objects.get(name='Push-up (Chống đẩy)'), 'weekday': 4, 'sets': 4, 'reps': 15},
            {'exercise': Exercise.objects.get(name='Squat (Gánh tạ)'), 'weekday': 4, 'sets': 4, 'reps': 20},
        ]

        for sched in schedules_plan2:
            WorkoutSchedule.objects.get_or_create(
                workout_plan=plan2,
                **sched
            )

        # Plan 3: Duy trì
        plan3, _ = WorkoutPlan.objects.get_or_create(
            user=users[2],
            name='Kế hoạch duy trì sức khỏe',
            goal='maintain',
            description='Kế hoạch cân bằng giữa cardio và strength training',
            start_date=date.today(),
            end_date=date.today() + timedelta(days=30),
            created_by=trainer
        )

        schedules_plan3 = [
            {'exercise': Exercise.objects.get(name='Chạy bộ'), 'weekday': 1, 'sets': 1, 'reps': 1},
            {'exercise': Exercise.objects.get(name='Push-up (Chống đẩy)'), 'weekday': 1, 'sets': 3, 'reps': 15},
            {'exercise': Exercise.objects.get(name='Sun Salutation (Chào mặt trời)'), 'weekday': 3, 'sets': 5,
             'reps': 1},
            {'exercise': Exercise.objects.get(name='Squat (Gánh tạ)'), 'weekday': 5, 'sets': 3, 'reps': 20},
            {'exercise': Exercise.objects.get(name='Đạp xe'), 'weekday': 5, 'sets': 1, 'reps': 1},
        ]

        for sched in schedules_plan3:
            WorkoutSchedule.objects.get_or_create(
                workout_plan=plan3,
                **sched
            )

        self.stdout.write('✓ Created workout plans')

    def create_nutrition_plans(self):
        users = User.objects.filter(role='user')
        nutritionist = User.objects.filter(role='nutritionist').first()

        # Plan 1: Giảm cân
        nplan1, _ = NutritionPlan.objects.get_or_create(
            user=users[0],
            name='Thực đơn giảm cân lành mạnh',
            goal='lose_weight',
            description='Thực đơn 1600 calories/ngày giúp giảm cân an toàn',
            daily_calories=1600,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=28),
            created_by=nutritionist
        )

        # Meals for Plan 1 (Giảm cân)
        meals_plan1 = [
            # Thứ 2
            {'food': Food.objects.get(name='Yến mạch sữa chua'), 'weekday': 0, 'portion': 1.0},
            {'food': Food.objects.get(name='Salad ức gà quinoa'), 'weekday': 0, 'portion': 1.0},
            {'food': Food.objects.get(name='Cá thu nướng rau củ'), 'weekday': 0, 'portion': 1.0},
            {'food': Food.objects.get(name='Táo hạt điều'), 'weekday': 0, 'portion': 1.0},

            # Thứ 3
            {'food': Food.objects.get(name='Trứng chiên rau củ'), 'weekday': 1, 'portion': 1.0},
            {'food': Food.objects.get(name='Bún cá hồi'), 'weekday': 1, 'portion': 0.8},
            {'food': Food.objects.get(name='Súp gà nấm'), 'weekday': 1, 'portion': 1.2},
            {'food': Food.objects.get(name='Hạnh nhân sữa chua'), 'weekday': 1, 'portion': 1.0},

            # Thứ 4
            {'food': Food.objects.get(name='Bánh mì nguyên cám bơ trứng'), 'weekday': 2, 'portion': 1.0},
            {'food': Food.objects.get(name='Cơm gạo lứt gà nướng'), 'weekday': 2, 'portion': 0.8},
            {'food': Food.objects.get(name='Tôm xào bông cải xanh'), 'weekday': 2, 'portion': 1.0},
            {'food': Food.objects.get(name='Chuối đậu phộng'), 'weekday': 2, 'portion': 1.0},

            # Thứ 5
            {'food': Food.objects.get(name='Yến mạch sữa chua'), 'weekday': 3, 'portion': 1.0},
            {'food': Food.objects.get(name='Salad ức gà quinoa'), 'weekday': 3, 'portion': 1.0},
            {'food': Food.objects.get(name='Cá thu nướng rau củ'), 'weekday': 3, 'portion': 1.0},
            {'food': Food.objects.get(name='Táo hạt điều'), 'weekday': 3, 'portion': 1.0},

            # Thứ 6
            {'food': Food.objects.get(name='Trứng chiên rau củ'), 'weekday': 4, 'portion': 1.0},
            {'food': Food.objects.get(name='Bún cá hồi'), 'weekday': 4, 'portion': 0.8},
            {'food': Food.objects.get(name='Súp gà nấm'), 'weekday': 4, 'portion': 1.2},
            {'food': Food.objects.get(name='Hạnh nhân sữa chua'), 'weekday': 4, 'portion': 1.0},
        ]

        for meal in meals_plan1:
            MealSchedule.objects.get_or_create(
                nutrition_plan=nplan1,
                **meal
            )

        # Plan 2: Tăng cơ
        nplan2, _ = NutritionPlan.objects.get_or_create(
            user=users[1],
            name='Thực đơn tăng cơ cao protein',
            goal='gain_muscle',
            description='Thực đơn 2200 calories/ngày giàu protein',
            daily_calories=2200,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=42),
            created_by=nutritionist
        )

        meals_plan2 = [
            # Thứ 2
            {'food': Food.objects.get(name='Yến mạch sữa chua'), 'weekday': 0, 'portion': 1.2},
            {'food': Food.objects.get(name='Cơm gạo lứt gà nướng'), 'weekday': 0, 'portion': 1.2},
            {'food': Food.objects.get(name='Tôm xào bông cải xanh'), 'weekday': 0, 'portion': 1.5},
            {'food': Food.objects.get(name='Chuối đậu phộng'), 'weekday': 0, 'portion': 1.5},
            {'food': Food.objects.get(name='Hạnh nhân sữa chua'), 'weekday': 0, 'portion': 1.0},

            # Thứ 3
            {'food': Food.objects.get(name='Trứng chiên rau củ'), 'weekday': 1, 'portion': 1.5},
            {'food': Food.objects.get(name='Bún cá hồi'), 'weekday': 1, 'portion': 1.2},
            {'food': Food.objects.get(name='Cá thu nướng rau củ'), 'weekday': 1, 'portion': 1.3},
            {'food': Food.objects.get(name='Táo hạt điều'), 'weekday': 1, 'portion': 1.5},

            # Thứ 4
            {'food': Food.objects.get(name='Bánh mì nguyên cám bơ trứng'), 'weekday': 2, 'portion': 1.5},
            {'food': Food.objects.get(name='Cơm gạo lứt gà nướng'), 'weekday': 2, 'portion': 1.2},
            {'food': Food.objects.get(name='Tôm xào bông cải xanh'), 'weekday': 2, 'portion': 1.5},
            {'food': Food.objects.get(name='Chuối đậu phộng'), 'weekday': 2, 'portion': 1.5},
        ]

        for meal in meals_plan2:
            MealSchedule.objects.get_or_create(
                nutrition_plan=nplan2,
                **meal
            )

        # Plan 3: Duy trì
        nplan3, _ = NutritionPlan.objects.get_or_create(
            user=users[2],
            name='Thực đơn cân bằng',
            goal='maintain',
            description='Thực đơn 1900 calories/ngày duy trì sức khỏe',
            daily_calories=1900,
            start_date=date.today(),
            end_date=date.today() + timedelta(days=30),
            created_by=nutritionist
        )

        meals_plan3 = [
            # Thứ 2
            {'food': Food.objects.get(name='Yến mạch sữa chua'), 'weekday': 0, 'portion': 1.0},
            {'food': Food.objects.get(name='Cơm gạo lứt gà nướng'), 'weekday': 0, 'portion': 1.0},
            {'food': Food.objects.get(name='Cá thu nướng rau củ'), 'weekday': 0, 'portion': 1.0},
            {'food': Food.objects.get(name='Táo hạt điều'), 'weekday': 0, 'portion': 1.0},

            # Thứ 3
            {'food': Food.objects.get(name='Bánh mì nguyên cám bơ trứng'), 'weekday': 1, 'portion': 1.0},
            {'food': Food.objects.get(name='Salad ức gà quinoa'), 'weekday': 1, 'portion': 1.0},
            {'food': Food.objects.get(name='Tôm xào bông cải xanh'), 'weekday': 1, 'portion': 1.0},
            {'food': Food.objects.get(name='Hạnh nhân sữa chua'), 'weekday': 1, 'portion': 1.0},

            # Thứ 4
            {'food': Food.objects.get(name='Trứng chiên rau củ'), 'weekday': 2, 'portion': 1.0},
            {'food': Food.objects.get(name='Bún cá hồi'), 'weekday': 2, 'portion': 1.0},
            {'food': Food.objects.get(name='Súp gà nấm'), 'weekday': 2, 'portion': 1.0},
            {'food': Food.objects.get(name='Chuối đậu phộng'), 'weekday': 2, 'portion': 1.0},
        ]

        for meal in meals_plan3:
            MealSchedule.objects.get_or_create(
                nutrition_plan=nplan3,
                **meal
            )

        self.stdout.write('✓ Created nutrition plans')