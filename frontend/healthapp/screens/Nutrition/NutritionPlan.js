import { View, Text, FlatList, TouchableOpacity, RefreshControl } from "react-native";
import { FAB, Card, Chip, ActivityIndicator } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";
import styles from "../../styles/screens/Nutrition/NutritionPlanStyles";

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
       
        loadPlans();
        const unsubscribe = nav.addListener('focus', loadPlans);
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
        <TouchableOpacity onPress={() => nav.navigate('NutritionPlanDetail', { id: item.id })}>
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

           
            <FAB
                style={styles.fab}
                icon="plus"
                onPress={() => nav.navigate('CreateNutritionPlan')}
            />
        </View>
    );
};

export default NutritionPlan;