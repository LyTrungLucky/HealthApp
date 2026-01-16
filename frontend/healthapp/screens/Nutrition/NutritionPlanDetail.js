import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Card, ActivityIndicator, Chip } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApis, endpoints } from '../../utils/Apis';
import { useRoute } from '@react-navigation/native';
import styles from '../../styles/screens/Nutrition/NutritionPlanDetailStyles';

const weekdayNames = ['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7','Chủ nhật'];

const NutritionPlanDetail = () => {
    const route = useRoute();
    const { id } = route.params || {};

    const [plan, setPlan] = useState(null);
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});

    const loadDetail = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const api = authApis(token);
            const [planRes, mealRes] = await Promise.all([
                api.get(endpoints['nutrition_detail'](id)),
                api.get(endpoints['meal_schedules'](id)),
            ]);

            setPlan(planRes.data);
            setMeals(mealRes.data);
        } catch (error) {
            console.error('Load nutrition detail error', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) loadDetail();
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const renderMealItem = (item) => (
        <Card style={styles.mealCard} key={String(item.id)}>
            <Card.Content>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={styles.foodName}>{item.food.name}</Text>
                </View>

                <Text style={styles.meta}>{item.food.meal_type_display || item.food.meal_type} • {Math.round(item.food.calories * item.portion)} kcal</Text>
                {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
            </Card.Content>
        </Card>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3b5998" />
            </View>
        );
    }

    if (!plan) {
        return (
            <View style={styles.center}>
                <Text>Không tìm thấy kế hoạch</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
            <View style={styles.header}>
                <Text style={styles.title}>{plan.name}</Text>
                <Chip style={styles.goalChip}>{plan.goal}</Chip>
                <Text style={styles.metaText}>{formatDate(plan.start_date)} - {formatDate(plan.end_date)}</Text>
                <Text style={styles.calorieText}>{plan.daily_calories} kcal/ngày</Text>
                {plan.created_by && (
                    <Text style={styles.createdBy}>Tạo bởi: {plan.created_by.first_name} {plan.created_by.last_name}</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mô tả</Text>
                <Text style={styles.sectionContent}>{plan.description || 'Không có mô tả'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Danh sách bữa ăn ({meals.length})</Text>

                {weekdayNames.map((dayName, idx) => {
                    const items = meals.filter(m => m.weekday === idx);
                    if (!items.length) return null;

                    const isOpen = !!expanded[idx];
                    return (
                        <View key={`meal-day-${idx}`} style={styles.dayBlock}>
                            <TouchableOpacity style={styles.weekdayHeader} onPress={() => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))}>
                                <Text style={styles.weekdayTitle}>{dayName}</Text>
                                <View style={styles.countBadge}>
                                    <Text style={styles.countText}>{items.length}</Text>
                                </View>
                            </TouchableOpacity>

                            {isOpen && (
                                <View style={styles.dayItems}>
                                    {items.map(renderMealItem)}
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
};

export default NutritionPlanDetail;
