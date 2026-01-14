import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { FAB, Card, Switch, ActivityIndicator } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const ReminderList = () => {
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const nav = useNavigation();

    const loadReminders = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const res = await authApis(token).get(endpoints['reminders']);
                setReminders(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const unsubscribe = nav.addListener('focus', loadReminders);
        return unsubscribe;
    }, [nav]);

    const toggleReminder = async (id) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                await authApis(token).patch(endpoints['toggle_reminder'](id));
                loadReminders();
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getReminderIcon = (type) => {
        const icons = {
            'water': '💧',
            'exercise': '🏃',
            'rest': '😴',
            'meal': '🍽️',
            'medicine': '💊',
        };
        return icons[type] || '⏰';
    };

    const formatDays = (days) => {
        const dayNames = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        return days.map(d => dayNames[d]).join(', ');
    };

    const renderReminder = ({ item }) => (
        <Card style={styles.card}>
            <Card.Content style={styles.cardContent}>
                <View style={styles.leftSection}>
                    <Text style={styles.icon}>{getReminderIcon(item.reminder_type)}</Text>
                    <View style={styles.info}>
                        <Text style={styles.title}>{item.title}</Text>
                        <Text style={styles.time}>{item.time}</Text>
                        <Text style={styles.days}>{formatDays(item.days_of_week)}</Text>
                    </View>
                </View>
                <Switch
                    value={item.is_enabled}
                    onValueChange={() => toggleReminder(item.id)}
                />
            </Card.Content>
        </Card>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b5998" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Nhắc nhở</Text>
            </View>

            <FlatList
                data={reminders}
                renderItem={renderReminder}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={loadReminders} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>⏰</Text>
                        <Text style={styles.emptyText}>Chưa có nhắc nhở nào</Text>
                        <Text style={styles.emptySubtext}>
                            Tạo nhắc nhở để không bỏ lỡ các hoạt động quan trọng!
                        </Text>
                    </View>
                }
            />

            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => nav.navigate('CreateReminder')}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { backgroundColor: '#3b5998', padding: 20, paddingTop: 50 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#ffffff' },
    listContainer: { padding: 15 },
    card: { marginBottom: 10 },
    cardContent: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    leftSection: { flexDirection: 'row', alignItems: 'center', flex: 1 },
    icon: { fontSize: 32, marginRight: 15 },
    info: { flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    time: { fontSize: 24, fontWeight: 'bold', color: '#3b5998', marginVertical: 5 },
    days: { fontSize: 12, color: '#666' },
    emptyContainer: { padding: 40, alignItems: 'center' },
    emptyIcon: { fontSize: 64, marginBottom: 15 },
    emptyText: { fontSize: 18, fontWeight: 'bold', color: '#666', marginBottom: 8 },
    emptySubtext: { fontSize: 14, color: '#999', textAlign: 'center' },
    fab: { position: 'absolute', margin: 16, right: 0, bottom: 0, backgroundColor: '#3b5998' },
});

export default ReminderList;