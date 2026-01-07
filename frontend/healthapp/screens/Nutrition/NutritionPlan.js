// screens/Nutrition/NutritionPlan.js
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { FAB, Card, Chip, ActivityIndicator } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const NutritionPlan = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const nav = useNavigation();

    const loadPlans = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const res = await authApis(token).get(endpoints['nutrition_plans']);
                setPlans(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        const unsubscribe = nav.addListener('focus', () => {
            loadPlans();
        });
        return unsubscribe;
    }, [nav]);

    const onRefresh = () => {
        setRefreshing(true);
        loadPlans();
    };

    const getGoalColor = (goal) => {
        switch(goal) {
            case 'lose_weight': return '#f44336';
            case 'gain_muscle': return '#4caf50';
            case 'maintain': return '#2196f3';
            default: return '#666';
        }
    };

    const getGoalText = (goal) => {
        switch(goal) {
            case 'lose_weight': return '🔥 Giảm cân';
            case 'gain_muscle': return '💪 Tăng cơ';
            case 'maintain': return '🎯 Duy trì';
            default: return goal;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const renderPlan = ({ item }) => (
        <TouchableOpacity onPress={() => console.log('View plan:', item.id)}>
            <Card style={styles.planCard}>
                <Card.Content>
                    <View style={styles.planHeader}>
                        <Text style={styles.planName}>{item.name}</Text>
                        <Chip 
                            style={[styles.goalChip, { backgroundColor: getGoalColor(item.goal) }]}
                            textStyle={styles.goalText}
                        >
                            {getGoalText(item.goal)}
                        </Chip>
                    </View>

                    <Text style={styles.planDescription}>{item.description}</Text>

                    <View style={styles.calorieBox}>
                        <Text style={styles.calorieValue}>{item.daily_calories}</Text>
                        <Text style={styles.calorieLabel}>Calories/ngày</Text>
                    </View>

                    <View style={styles.planMeta}>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaIcon}>📅</Text>
                            <Text style={styles.metaText}>
                                {formatDate(item.start_date)} - {formatDate(item.end_date)}
                            </Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Text style={styles.metaIcon}>🍽️</Text>
                            <Text style={styles.metaText}>
                                {item.total_meals || 0} bữa ăn
                            </Text>
                        </View>
                    </View>

                    {item.created_by && (
                        <Text style={styles.createdBy}>
                            Tạo bởi: {item.created_by.first_name} {item.created_by.last_name}
                        </Text>
                    )}
                </Card.Content>
            </Card>
        </TouchableOpacity>
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
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Kế hoạch dinh dưỡng</Text>
            </View>

            <FlatList
                data={plans}
                renderItem={renderPlan}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>🥗</Text>
                        <Text style={styles.emptyText}>Chưa có kế hoạch dinh dưỡng</Text>
                        <Text style={styles.emptySubtext}>
                            Tạo kế hoạch dinh dưỡng để quản lý chế độ ăn của bạn!
                        </Text>
                    </View>
                }
            />

            {/* FAB for creating new plan */}
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => nav.navigate('CreateNutritionPlan')}
            />
        </View>
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
        backgroundColor: '#3b5998',
        padding: 20,
        paddingTop: 50,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    listContainer: {
        padding: 15,
    },
    planCard: {
        marginBottom: 15,
        elevation: 2,
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    planName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        flex: 1,
        marginRight: 10,
    },
    goalChip: {
        height: 28,
    },
    goalText: {
        fontSize: 12,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    planDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
        lineHeight: 20,
    },
    calorieBox: {
        flexDirection: 'row',
        alignItems: 'baseline',
        backgroundColor: '#fff3e0',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        justifyContent: 'center',
    },
    calorieValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ff9800',
        marginRight: 8,
    },
    calorieLabel: {
        fontSize: 14,
        color: '#666',
    },
    planMeta: {
        marginBottom: 10,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    metaIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    metaText: {
        fontSize: 13,
        color: '#666',
    },
    createdBy: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: 15,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        textAlign: 'center',
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#4caf50',
    },
});

export default NutritionPlan;