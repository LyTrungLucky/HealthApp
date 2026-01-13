import axios from "axios";

const BASE_URL = 'http://192.168.1.13:8000'; 

export const endpoints = {
    // Auth
    'register': '/register/',
    'login': '/o/token/',
    'current_user': '/users/current-user/',
    
    
    // Health Profile
    'health_profile': '/health-profiles/',
    'my_profile': '/health-profiles/my-profile/',
    
    // Daily Tracking
    'daily_tracking': '/daily-tracking/',
    'today_tracking': '/daily-tracking/today/',
    'weekly_summary': '/daily-tracking/weekly-summary/',
    
    // Exercise
    'exercise_categories': '/exercise-categories/',
    'exercises': '/exercises/',
    'exercise_detail': (id) => `/exercises/${id}/`,
    'recommended_exercises': '/exercises/recommended/',
    
    // Workout Plan
    'workout_plans': '/workout-plans/',
    'workout_detail': (id) => `/workout-plans/${id}/`,
    'workout_schedules': (id) => `/workout-plans/${id}/schedules/`,
    'add_exercise_to_plan': (id) => `/workout-plans/${id}/add-exercise/`,
    'workout_templates': '/workout-plans/templates/',
    'clone_workout_plan': (id) => `/workout-plans/${id}/clone/`,

    // Food & Nutrition
    'foods': '/foods/',
    'food_detail': (id) => `/foods/${id}/`,
    'recommended_foods': '/foods/recommended/',
    
    // Nutrition Plan
    'nutrition_plans': '/nutrition-plans/',
    'nutrition_detail': (id) => `/nutrition-plans/${id}/`,
    // Some backends expose plan meals under a "schedules" subpath (see workout_schedules pattern).
    // If your backend uses a different path (e.g. `/meals/`), revert this or update accordingly.
    'meal_schedules': (id) => `/nutrition-plans/${id}/meals/`,
    'add_meal_to_plan': (id) => `/nutrition-plans/${id}/add-meal/`,
    'nutrition_templates': '/nutrition-plans/templates/',
    'clone_nutrition_plan': (id) => `/nutrition-plans/${id}/clone/`,
    
    // Progress
    'progress': '/progress/',
    'chart_data': '/progress/chart-data/',
    
    // Expert & Consultation
    'experts': '/experts/',
    'consultations': '/consultations/',
    'upcoming_consultations': '/consultations/upcoming/',
};

export const authApis = (token) => {
    return axios.create({
        baseURL: BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export default axios.create({
    baseURL: BASE_URL
});