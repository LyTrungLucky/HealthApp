// screens/Home/Home.js
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, RefreshControl } from "react-native";
import { Card, Avatar, Button, ActivityIndicator } from "react-native-paper";
import { useContext, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../utils/contexts/MyContext";
import { authApis, endpoints } from "../../utils/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserMenu from "../../components/UserMenu";


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
                // Load health profile
                try {
                    const profileRes = await authApis(token).get(endpoints['my_profile']);
                    setHealthProfile(profileRes.data);
                } catch (err) {
                    console.log("No health profile yet");
                }

                // Load today tracking
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
            <View style={styles.loadingContainer}>
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
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Xin chào,</Text>
                    <Text style={styles.userName}>
                        {user?.first_name || user?.username} 👋
                    </Text>
                </View>

                {/* MENU USER CUSTOM */}
                <UserMenu />
            </View>



            {/* Health Summary Card */}
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

            {/* Today Tracking */}
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

            {/* Quick Actions */}
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#3b5998',
        paddingTop: 50,
    },
    greeting: {
        fontSize: 16,
        color: '#e0e0e0',
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    summaryCard: {
        margin: 15,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    healthInfo: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    healthItem: {
        alignItems: 'center',
    },
    healthLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    healthValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#3b5998',
    },
    infoText: {
        color: '#666',
        marginBottom: 15,
        textAlign: 'center',
    },
    createButton: {
        marginTop: 10,
    },
    trackingCard: {
        marginHorizontal: 15,
        marginBottom: 15,
        elevation: 3,
    },
    trackingGrid: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    trackingItem: {
        alignItems: 'center',
    },
    trackingIcon: {
        fontSize: 32,
        marginBottom: 5,
    },
    trackingValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    trackingLabel: {
        fontSize: 12,
        color: '#666',
    },
    quickActions: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionCard: {
        width: '48%',
        padding: 20,
        borderRadius: 15,
        marginBottom: 15,
        alignItems: 'center',
        elevation: 2,
    },
    actionIcon: {
        fontSize: 40,
        marginBottom: 10,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    actionSubtitle: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
    },
});

export default Home;