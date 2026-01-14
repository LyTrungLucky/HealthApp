import axios from "axios";


const BASE_URL = 'http://10.0.2.2:8000';  

export const endpoints = {
  
    'register': '/register/',
    'login': '/o/token/',
    'current_user': '/users/current-user/',
    
    
   
    'health_profile': '/health-profiles/',
    'my_profile': '/health-profiles/my-profile/',
    
   
    'daily_tracking': '/daily-tracking/',
    'today_tracking': '/daily-tracking/today/',
    'weekly_summary': '/daily-tracking/weekly-summary/',
    
  
    'exercise_categories': '/exercise-categories/',
    'exercises': '/exercises/',
    'exercise_detail': (id) => `/exercises/${id}/`,
    'recommended_exercises': '/exercises/recommended/',
    
    
    'workout_plans': '/workout-plans/',
    'workout_detail': (id) => `/workout-plans/${id}/`,
    'workout_schedules': (id) => `/workout-plans/${id}/schedules/`,
    'add_exercise_to_plan': (id) => `/workout-plans/${id}/add-exercise/`,
    'workout_templates': '/workout-plans/templates/',
    'clone_workout_plan': (id) => `/workout-plans/${id}/clone/`,

    
    'foods': '/foods/',
    'food_detail': (id) => `/foods/${id}/`,
    'recommended_foods': '/foods/recommended/',
    
    'nutrition_plans': '/nutrition-plans/',
    'nutrition_detail': (id) => `/nutrition-plans/${id}/`,
    
    'meal_schedules': (id) => `/nutrition-plans/${id}/meals/`,
    'add_meal_to_plan': (id) => `/nutrition-plans/${id}/add-meal/`,
    'nutrition_templates': '/nutrition-plans/templates/',
    'clone_nutrition_plan': (id) => `/nutrition-plans/${id}/clone/`,
    
    
    'progress': '/progress/',
    'chart_data': '/progress/chart-data/',
    
    'experts': '/experts/',
    'consultations': '/consultations/',
    'upcoming_consultations': '/consultations/upcoming/',

    
    'reminders': '/reminders/',
    'reminder_detail': (id) => `/reminders/${id}/`,
    'today_reminders': '/reminders/today/',
    'toggle_reminder': (id) => `/reminders/${id}/toggle/`,

    'my_clients': '/health-profiles/my-clients/',
    'client_progress': (id) => `/progress/client/${id}/`,
    'health_journals': '/journals/',

    'chat_rooms': '/chat-rooms/',
    'start_chat': (expertId) => `/chat-rooms/start/${expertId}/`,
    'chat_messages': (roomId) => `/chat-rooms/${roomId}/messages/`,
    'send_message': (roomId) => `/chat-rooms/${roomId}/send/`,

    
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