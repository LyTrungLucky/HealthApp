import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { List, Divider, Avatar } from "react-native-paper";
import { useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../../utils/contexts/MyContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Profile = () => {
    const [user, dispatch] = useContext(MyUserContext);
    const nav = useNavigation();

    const logout = () => {
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

    const getRoleLabel = (role) => {
        switch (role) {
            case 'user': return 'Người dùng';
            case 'nutritionist': return 'Chuyên gia dinh dưỡng';
            case 'trainer': return 'Huấn luyện viên';
            default: return 'Người dùng';
        }
    };

    return (
        <View style={styles.container}>
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Hồ Sơ</Text>
            </View>

            <ScrollView style={styles.content}>
                
                <View style={styles.userCard}>
                    <Avatar.Image
                        size={80}
                        source={user?.avatar ? { uri: user.avatar } : require('../../assets/icon.png')}
                        style={styles.avatar}
                    />
                    <Text style={styles.userName}>
                        {user?.first_name} {user?.last_name}
                    </Text>
                    <Text style={styles.userRole}>{getRoleLabel(user?.role)}</Text>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                </View>

                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Sức khỏe</Text>

                    <List.Item
                        title="Hồ sơ sức khỏe"
                        description="Quản lý thông tin sức khỏe của bạn"
                        left={props => <List.Icon {...props} icon="heart-pulse" color="#e91e63" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => nav.navigate('HealthProfile')}
                        style={styles.listItem}
                    />

                    <Divider />

                    <List.Item
                        title="Theo dõi hàng ngày"
                        description="Cập nhật hoạt động hàng ngày"
                        left={props => <List.Icon {...props} icon="calendar-today" color="#2196f3" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => nav.navigate('DailyTracking')}
                        style={styles.listItem}
                    />

                    <Divider />

                    <List.Item
                        title="Tiến độ"
                        description="Xem biểu đồ tiến độ"
                        left={props => <List.Icon {...props} icon="chart-line" color="#4caf50" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => nav.navigate('Progress')}
                        style={styles.listItem}
                    />

                    <Divider />

                    <List.Item
                        title="Nhắc nhở"
                        description="Quản lý lịch nhắc nhở"
                        left={props => <List.Icon {...props} icon="bell-outline" color="#ff5722" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => nav.navigate('ReminderList')}
                        style={styles.listItem}
                    />

                    <Divider />
                    
                    <List.Item
                        title="📖 Nhật ký sức khỏe"
                        description="Ghi lại cảm nhận hàng ngày"
                        left={props => <List.Icon {...props} icon="book-open-page-variant" color="#9c27b0" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => nav.navigate('Journal', { screen: 'JournalList' })}
                        style={styles.listItem}
                    />

                </View>

                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Kế hoạch</Text>

                    <List.Item
                        title="Kế hoạch tập luyện"
                        description="Quản lý lịch tập"
                        left={props => <List.Icon {...props} icon="dumbbell" color="#ff9800" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => nav.navigate('Plans', { screen: 'WorkoutPlan' })}
                        style={styles.listItem}
                    />

                    <Divider />

                    <List.Item
                        title="Kế hoạch dinh dưỡng"
                        description="Quản lý thực đơn"
                        left={props => <List.Icon {...props} icon="food-apple" color="#8bc34a" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => nav.navigate('Plans', { screen: 'NutritionPlan' })}
                        style={styles.listItem}
                    />
                </View>

                
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Cài đặt</Text>

                    <List.Item
                        title="Thông tin cá nhân"
                        description="Cập nhật thông tin"
                        left={props => <List.Icon {...props} icon="account-edit" color="#607d8b" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { }}
                        style={styles.listItem}
                    />

                    <Divider />

                    <List.Item
                        title="Đổi mật khẩu"
                        description="Thay đổi mật khẩu"
                        left={props => <List.Icon {...props} icon="lock-reset" color="#795548" />}
                        right={props => <List.Icon {...props} icon="chevron-right" />}
                        onPress={() => { }}
                        style={styles.listItem}
                    />
                </View>

                
                <TouchableOpacity style={styles.logoutButton} onPress={logout}>
                    <Text style={styles.logoutText}>Đăng xuất</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#3b5998',
        padding: 20,
        paddingTop: 50,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    content: {
        flex: 1,
    },
    userCard: {
        backgroundColor: '#ffffff',
        padding: 30,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    avatar: {
        marginBottom: 15,
        backgroundColor: '#e0e0e0',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    userRole: {
        fontSize: 14,
        color: '#3b5998',
        marginBottom: 5,
        fontWeight: '600',
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    section: {
        backgroundColor: '#ffffff',
        marginTop: 15,
        paddingVertical: 5,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#666',
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#f5f5f5',
    },
    listItem: {
        paddingVertical: 5,
    },
    logoutButton: {
        backgroundColor: '#f44336',
        margin: 20,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        elevation: 2,
    },
    logoutText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Profile;