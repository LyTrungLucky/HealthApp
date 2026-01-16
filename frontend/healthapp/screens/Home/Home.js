
import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from "react-native";
import { Card, Avatar, Button, ActivityIndicator } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../utils/contexts/MyContext";
import { authApis, endpoints } from "../../utils/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserMenu from "../../components/UserMenu";
import styles from "../../styles/screens/Home/HomeStyles";


const Home = () => {
    const [user, dispatch] = useContext(MyUserContext);

    const [menuVisible, setMenuVisible] = useState(false);
    const [healthProfile, setHealthProfile] = useState(null);
    const [todayTracking, setTodayTracking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const nav = useNavigation();

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);


    const logout = async () => {
        Alert.alert(
            "Đăng xuất",
            "Bạn có chắc chắn muốn đăng xuất?",
            [
                { text: "Hủy", style: "cancel" },
                {
                    text: "Đăng xuất",
                    style: "destructive",
                    onPress: async () => {
                        await AsyncStorage.removeItem("token");
                        dispatch({ type: "logout" });
                    }
                }
            ]
        );
    };


    const loadData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                try {
                    const profileRes = await authApis(token).get(endpoints['my_profile']);
                    setHealthProfile(profileRes.data);
                } catch (err) {
                    console.log("No health profile yet");
                }

                try {
                    const trackingRes = await authApis(token).get(endpoints['today_tracking']);
                    setTodayTracking(trackingRes.data);
                } catch (err) {
                    console.log("No tracking today");
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    if (loading) {
        return (
            <View style={styles.homeLoadingContainer}>
                <ActivityIndicator size="large" color="#3b5998" />
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.container}
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Xin chào,</Text>
                    <Text style={styles.userName}>
                        {user?.first_name || user?.username} 👋
                    </Text>
                </View>

                <UserMenu />
            </View>

            {healthProfile ? (
                <Card style={styles.summaryCard}>
                    <Card.Content>
                        <Text style={styles.cardTitle}>Thông tin sức khỏe</Text>
                        <View style={styles.healthInfo}>
                            <View style={styles.healthItem}>
                                <Text style={styles.healthLabel}>BMI</Text>
                                <Text style={styles.healthValue}>{healthProfile.bmi}</Text>
                            </View>
                            <View style={styles.healthItem}>
                                <Text style={styles.healthLabel}>Cân nặng</Text>
                                <Text style={styles.healthValue}>{healthProfile.weight} kg</Text>
                            </View>
                            <View style={styles.healthItem}>
                                <Text style={styles.healthLabel}>Mục tiêu</Text>
                                <Text style={styles.healthValue}>
                                    {healthProfile.goal === 'lose_weight' ? '🔥 Giảm cân' :
                                        healthProfile.goal === 'gain_muscle' ? '💪 Tăng cơ' : '🎯 Duy trì'}
                                </Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>
            ) : (
                <Card style={styles.summaryCard}>
                    <Card.Content>
                        <Text style={styles.cardTitle}>Hồ sơ sức khỏe</Text>
                        <Text style={styles.infoText}>
                            Bạn chưa tạo hồ sơ sức khỏe. Hãy tạo ngay để bắt đầu theo dõi!
                        </Text>
                        <Button
                            mode="contained"
                            onPress={() => nav.navigate('Profile', { screen: 'HealthProfile' })}
                            style={styles.createButton}
                        >
                            Tạo hồ sơ sức khỏe
                        </Button>
                    </Card.Content>
                </Card>
            )}

            {todayTracking && (
                <Card style={styles.trackingCard}>
                    <Card.Content>
                        <Text style={styles.cardTitle}>Hoạt động hôm nay</Text>
                        <View style={styles.trackingGrid}>
                            <View style={styles.trackingItem}>
                                <Text style={styles.trackingIcon}>💧</Text>
                                <Text style={styles.trackingValue}>{todayTracking.water_intake} ml</Text>
                                <Text style={styles.trackingLabel}>Nước uống</Text>
                            </View>
                            <View style={styles.trackingItem}>
                                <Text style={styles.trackingIcon}>👟</Text>
                                <Text style={styles.trackingValue}>{todayTracking.steps}</Text>
                                <Text style={styles.trackingLabel}>Bước chân</Text>
                            </View>
                            {todayTracking.heart_rate && (
                                <View style={styles.trackingItem}>
                                    <Text style={styles.trackingIcon}>❤️</Text>
                                    <Text style={styles.trackingValue}>{todayTracking.heart_rate} bpm</Text>
                                    <Text style={styles.trackingLabel}>Nhịp tim</Text>
                                </View>
                            )}
                        </View>
                    </Card.Content>
                </Card>
            )}

            <View style={styles.quickActions}>
                <Text style={styles.sectionTitle}>Khám phá</Text>

                <View style={styles.actionGrid}>
                    <TouchableOpacity
                        style={[styles.actionCard, { backgroundColor: '#e3f2fd' }]}
                        onPress={() => nav.navigate('ExerciseList')}
                    >
                        <Text style={styles.actionIcon}>💪</Text>
                        <Text style={styles.actionTitle}>Bài tập</Text>
                        <Text style={styles.actionSubtitle}>Khám phá bài tập</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionCard, { backgroundColor: '#fff3e0' }]}
                        onPress={() => nav.navigate('FoodList')}
                    >
                        <Text style={styles.actionIcon}>🥗</Text>
                        <Text style={styles.actionTitle}>Dinh dưỡng</Text>
                        <Text style={styles.actionSubtitle}>Thực đơn lành mạnh</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionCard, { backgroundColor: '#f3e5f5' }]}
                        onPress={() => nav.navigate('Plans')}
                    >
                        <Text style={styles.actionIcon}>📋</Text>
                        <Text style={styles.actionTitle}>Kế hoạch</Text>
                        <Text style={styles.actionSubtitle}>Tạo kế hoạch</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.actionCard, { backgroundColor: '#e8f5e9' }]}
                        onPress={() => nav.navigate('Expert')}
                    >
                        <Text style={styles.actionIcon}>👨‍⚕️</Text>
                        <Text style={styles.actionTitle}>Chuyên gia</Text>
                        <Text style={styles.actionSubtitle}>Tư vấn trực tiếp</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};


export default Home;