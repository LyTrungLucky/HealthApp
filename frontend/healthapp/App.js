import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-paper";
import { MyUserContext } from "./utils/contexts/MyContext";
import { useContext, useReducer, useState } from "react";
import { View, Text, TouchableOpacity } from 'react-native';
import MyUserReducer from "./utils/reducers/MyUserReducer";
import { Provider as PaperProvider } from "react-native-paper";
import styles from "./styles/AppStyles";


import Welcome from "./screens/Auth/Welcome";
import Register from "./screens/Auth/Register";
import Login from "./screens/Auth/Login";


import Home from "./screens/Home/Home";


import ExerciseList from "./screens/Exercise/ExerciseList";
import ExerciseDetail from "./screens/Exercise/ExerciseDetail";
import WorkoutPlan from "./screens/Exercise/WorkoutPlan";
import CreateWorkoutPlan from "./screens/Exercise/CreateWorkoutPlan";
import WorkoutPlanDetail from "./screens/Exercise/WorkoutPlanDetail";


import FoodList from "./screens/Nutrition/FoodList";
import FoodDetail from "./screens/Nutrition/FoodDetail";
import NutritionPlan from "./screens/Nutrition/NutritionPlan";
import CreateNutritionPlan from "./screens/Nutrition/CreateNutritionPlan";
import NutritionPlanDetail from "./screens/Nutrition/NutritionPlanDetail";


import Profile from "./screens/Profile/Profile";
import HealthProfile from "./screens/Profile/HealthProfile";
import DailyTracking from "./screens/Profile/DailyTracking";
import Progress from "./screens/Profile/Progress";

import ReminderList from "./screens/Reminder/ReminderList";
import CreateReminder from "./screens/Reminder/CreateReminder";

import JournalList from "./screens/Journal/JournalList";
import CreateJournal from "./screens/Journal/CreateJournal";
import JournalDetail from "./screens/Journal/JournalDetail";

import ChatList from "./screens/Chat/ChatList";
import ChatScreen from "./screens/Chat/ChatScreen";

import ExpertList from "./screens/Expert/ExpertList";
import ClientList from "./screens/Expert/ClientList";
import ClientProgress from "./screens/Expert/ClientProgress";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={Home} />
    <Stack.Screen name="ExerciseList" component={ExerciseList} />
    <Stack.Screen name="ExerciseDetail" component={ExerciseDetail} />
    <Stack.Screen name="FoodList" component={FoodList} />
    <Stack.Screen name="FoodDetail" component={FoodDetail} />
  </Stack.Navigator>
);

const PlansHome = ({ navigation }) => {
  const [active, setActive] = useState('workout');

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tabButton, active === 'workout' && styles.activeTab]}
          onPress={() => setActive('workout')}
        >
          <Text style={styles.tabText}>Tập luyện</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, active === 'nutrition' && styles.activeTab]}
          onPress={() => setActive('nutrition')}
        >
          <Text style={styles.tabText}>Dinh dưỡng</Text>
        </TouchableOpacity>
      </View>

      {active === 'workout' ? <WorkoutPlan /> : <NutritionPlan />}
    </View>
  );
};

const PlansStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PlansHome" component={PlansHome} />
    <Stack.Screen name="WorkoutPlan" component={WorkoutPlan} />
    <Stack.Screen name="CreateWorkoutPlan" component={CreateWorkoutPlan} />
    <Stack.Screen name="WorkoutPlanDetail" component={WorkoutPlanDetail} />
    <Stack.Screen name="NutritionPlan" component={NutritionPlan} />
    <Stack.Screen name="CreateNutritionPlan" component={CreateNutritionPlan} />
    <Stack.Screen name="NutritionPlanDetail" component={NutritionPlanDetail} />
  </Stack.Navigator>
);


const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileMain" component={Profile} />
    <Stack.Screen name="HealthProfile" component={HealthProfile} />
    <Stack.Screen name="DailyTracking" component={DailyTracking} />
    <Stack.Screen name="Progress" component={Progress} />
    <Stack.Screen name="ReminderList" component={ReminderList} />
    <Stack.Screen name="CreateReminder" component={CreateReminder} />
    <Stack.Screen name="ChatList" component={ChatList} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} />
  </Stack.Navigator>
);

const JournalStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="JournalList" component={JournalList} />
    <Stack.Screen name="CreateJournal" component={CreateJournal} />
    <Stack.Screen name="JournalDetail" component={JournalDetail} />
  </Stack.Navigator>
);

const ExpertStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ExpertMain" component={ExpertList} />
    <Stack.Screen name="ClientList" component={ClientList} />
    <Stack.Screen name="ClientProgress" component={ClientProgress} />
    <Stack.Screen name="ChatScreen" component={ChatScreen} />
  </Stack.Navigator>
);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }) => (
            <Icon source="home" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Plans"
        component={PlansStack}
        options={{
          title: "Kế hoạch",
          tabBarIcon: ({ color }) => (
            <Icon source="calendar-check" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalStack}
        options={{
          title: "Nhật ký",
          tabBarIcon: ({ color }) => (
            <Icon source="book-open-page-variant" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Expert"
        component={ExpertStack}
        options={{
          title: "Chuyên gia",
          tabBarIcon: ({ color }) => (
            <Icon source="account-group" color={color} size={24} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          title: "Hồ sơ",
          tabBarIcon: ({ color }) => (
            <Icon source="account" color={color} size={24} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};


const RootNavigator = () => {
  const [user] = useContext(MyUserContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user === null ? (
        <>
          <Stack.Screen name="Welcome" component={Welcome} />
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="Register" component={Register} />
        </>
      ) : (
        <Stack.Screen name="MainApp" component={MainTabNavigator} />
      )}
    </Stack.Navigator>
  );
};


const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <PaperProvider>
      <MyUserContext.Provider value={[user, dispatch]}>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </MyUserContext.Provider>
    </PaperProvider>
  );
};

export default App;