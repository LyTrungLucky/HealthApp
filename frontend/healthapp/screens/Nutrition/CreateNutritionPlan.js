// screens/Nutrition/CreateNutritionPlan.js
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button, RadioButton, Card, Chip, ActivityIndicator } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const CreateNutritionPlan = () => {
    const [healthProfile, setHealthProfile] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [recommendedFoods, setRecommendedFoods] = useState([]);
    const [selectedFoods, setSelectedFoods] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState('template');
    
    const [formData, setFormData] = useState({
        name: '',
        goal: 'maintain',
        description: '',
        daily_calories: '',
        duration: '4', // weeks
    });

    const nav = useNavigation();

    const goalOptions = [
        { value: 'lose_weight', label: '🔥 Giảm cân', calories: 1600 },
        { value: 'gain_muscle', label: '💪 Tăng cơ', calories: 2200 },
        { value: 'maintain', label: '🎯 Duy trì', calories: 1900 },
    ];

    useEffect(() => {
        loadData();
    }, []);

    useEffect(() => {
        if (formData.goal) {
            loadTemplates();
        }
    }, [formData.goal]);

    const loadData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const profileRes = await authApis(token).get(endpoints['my_profile']);
                setHealthProfile(profileRes.data);
                
                const goalCalories = goalOptions.find(g => g.value === profileRes.data.goal)?.calories || 1900;
                setFormData({
                    ...formData,
                    goal: profileRes.data.goal,
                    daily_calories: goalCalories.toString(),
                });

                const foodsRes = await authApis(token).get(endpoints['recommended_foods']);
                setRecommendedFoods(foodsRes.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadTemplates = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const res = await authApis(token).get(endpoints['nutrition_templates'], {
                    params: { goal: formData.goal }
                });
                setTemplates(res.data);
            }
        } catch (error) {
            console.error('Error loading templates:', error);
        }
    };

    const handleUseTemplate = async () => {
        // Ensure templates are loaded
        try {
            const token = await AsyncStorage.getItem('token');
            if (token && templates.length === 0) {
                await loadTemplates();
            }

            if (!templates || templates.length === 0) {
                Alert.alert('Không có mẫu', 'Không tìm thấy thực đơn mẫu phù hợp.');
                return;
            }

            // Build buttons for Alert from templates
            const buttons = templates.slice(0, 5).map((t) => ({
                text: t.name,
                onPress: () => handleSelectTemplate(t)
            }));

            // If there are more than 5 templates, add a Browse option
            if (templates.length > 5) {
                buttons.push({ text: 'Xem tất cả', onPress: () => {
                    // fallback: just select first template for now
                    handleSelectTemplate(templates[0]);
                }});
            }

            buttons.push({ text: 'Hủy', style: 'cancel' });

            Alert.alert('Chọn thực đơn mẫu', 'Chọn một mẫu để áp dụng', buttons);
        } catch (error) {
            console.error('Error opening templates:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách mẫu.');
        }
    };

    const handleSelectTemplate = async (template) => {
        setSelectedTemplate(template);
        setFormData({
            ...formData,
            name: template.name,
            description: template.description,
            daily_calories: template.daily_calories.toString(),
        });

        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const mealsRes = await authApis(token).get(endpoints['meal_schedules'](template.id));
                const foodIds = mealsRes.data.map(m => m.food.id);
                const selected = recommendedFoods.filter(f => foodIds.includes(f.id));
                setSelectedFoods(selected);
                
                Alert.alert(
                    "Kế hoạch mẫu",
                    `Đã chọn: ${template.name}\n${selected.length} món ăn đã được thêm tự động.`
                );
            }
        } catch (error) {
            console.error('Error loading template meals:', error);
        }
    };

    const handleCloneTemplate = async (templateId) => {
        setSaving(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                await authApis(token).post(endpoints['clone_nutrition_plan'](templateId));
                
                Alert.alert(
                    "Thành công!",
                    "Đã sao chép kế hoạch mẫu vào danh sách của bạn!",
                    [{ text: "OK", onPress: () => nav.goBack() }]
                );
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Không thể sao chép kế hoạch!");
        } finally {
            setSaving(false);
        }
    };

    const toggleFood = (food) => {
        const isSelected = selectedFoods.find(f => f.id === food.id);
        if (isSelected) {
            setSelectedFoods(selectedFoods.filter(f => f.id !== food.id));
        } else {
            setSelectedFoods([...selectedFoods, food]);
        }
    };

    const getTotalCalories = () => {
        return selectedFoods.reduce((sum, food) => sum + food.calories, 0);
    };

    const getMealTypeIcon = (mealType) => {
        switch(mealType) {
            case 'breakfast': return '🌅';
            case 'lunch': return '☀️';
            case 'dinner': return '🌙';
            case 'snack': return '🍎';
            default: return '🍽️';
        }
    };

    const groupFoodsByMealType = () => {
        const grouped = {};
        selectedFoods.forEach(food => {
            if (!grouped[food.meal_type]) {
                grouped[food.meal_type] = [];
            }
            grouped[food.meal_type].push(food);
        });
        return grouped;
    };

    const handleSave = async () => {
        if (!formData.name) {
            Alert.alert("Lỗi", "Vui lòng nhập tên kế hoạch!");
            return;
        }

        if (!formData.daily_calories) {
            Alert.alert("Lỗi", "Vui lòng nhập lượng calories hàng ngày!");
            return;
        }

        if (selectedFoods.length === 0) {
            Alert.alert("Lỗi", "Vui lòng chọn ít nhất 1 món ăn!");
            return;
        }

        setSaving(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const today = new Date();
                const endDate = new Date(today);
                endDate.setDate(today.getDate() + (parseInt(formData.duration) * 7));

                const planData = {
                    name: formData.name,
                    goal: formData.goal,
                    description: formData.description,
                    daily_calories: parseInt(formData.daily_calories),
                    start_date: today.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0],
                };

                // Create nutrition plan
                const planRes = await authApis(token).post(endpoints['nutrition_plans'], planData);
                const planId = planRes.data.id;

                // Add meals to plan
                // Distribute meals across the week
                const groupedFoods = groupFoodsByMealType();
                const daysOfWeek = [0, 1, 2, 3, 4]; // Mon to Fri

                for (const [mealType, foods] of Object.entries(groupedFoods)) {
                    for (let i = 0; i < foods.length && i < daysOfWeek.length; i++) {
                        const mealData = {
                            food_id: foods[i].id,
                            weekday: daysOfWeek[i],
                            portion: 1.0,
                        };

                        await authApis(token).post(
                            endpoints['add_meal_to_plan'](planId),
                            mealData
                        );
                    }
                }

                Alert.alert(
                    "Thành công!",
                    "Kế hoạch dinh dưỡng đã được tạo thành công!",
                    [
                        {
                            text: "OK",
                            onPress: () => nav.goBack()
                        }
                    ]
                );
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Không thể tạo kế hoạch. Vui lòng thử lại!");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b5998" />
            </View>
        );
    }

    if (!healthProfile) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>⚠️ Vui lòng tạo hồ sơ sức khỏe trước</Text>
                <Button mode="contained" onPress={() => nav.navigate('Profile', { screen: 'HealthProfile' })}>
                    Tạo hồ sơ sức khỏe
                </Button>
            </View>
        );
    }

    const totalCalories = getTotalCalories();
    const caloriesDiff = totalCalories - parseInt(formData.daily_calories || 0);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tạo kế hoạch dinh dưỡng</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {/* Mode Selection */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Chọn cách tạo kế hoạch</Text>
                        <View style={styles.modeButtons}>
                            <TouchableOpacity
                                style={[
                                    styles.modeButton,
                                    mode === 'template' && styles.modeButtonActive
                                ]}
                                onPress={() => setMode('template')}
                            >
                                <Text style={styles.modeIcon}>📋</Text>
                                <Text style={[
                                    styles.modeText,
                                    mode === 'template' && styles.modeTextActive
                                ]}>
                                    Thực đơn mẫu
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[
                                    styles.modeButton,
                                    mode === 'custom' && styles.modeButtonActive
                                ]}
                                onPress={() => setMode('custom')}
                            >
                                <Text style={styles.modeIcon}>✏️</Text>
                                <Text style={[
                                    styles.modeText,
                                    mode === 'custom' && styles.modeTextActive
                                ]}>
                                    Tự tạo
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </Card.Content>
                </Card>

                {/* Goal Selection */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Mục tiêu</Text>
                        <RadioButton.Group
                            onValueChange={(value) => {
                                const calories = goalOptions.find(g => g.value === value)?.calories || 1900;
                                setFormData({
                                    ...formData,
                                    goal: value,
                                    daily_calories: calories.toString()
                                });
                            }}
                            value={formData.goal}
                        >
                            {goalOptions.map((option) => (
                                <View key={option.value} style={styles.radioItem}>
                                    <RadioButton value={option.value} />
                                    <Text style={styles.radioLabel}>
                                        {option.label} ({option.calories} cal)
                                    </Text>
                                </View>
                            ))}
                        </RadioButton.Group>

                        {mode === 'template' && (
                            <Button
                                mode="outlined"
                                onPress={handleUseTemplate}
                                style={styles.templateButton}
                                icon="lightbulb-on"
                            >
                                Sử dụng thực đơn mẫu
                            </Button>
                        )}
                    </Card.Content>
                </Card>

                {/* Plan Details */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Thông tin kế hoạch</Text>
                        
                        <TextInput
                            label="Tên kế hoạch"
                            value={formData.name}
                            onChangeText={(text) => setFormData({...formData, name: text})}
                            mode="outlined"
                            style={styles.input}
                        />

                        <TextInput
                            label="Mô tả"
                            value={formData.description}
                            onChangeText={(text) => setFormData({...formData, description: text})}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                        />

                        <View style={styles.rowInputs}>
                            <TextInput
                                label="Calories/ngày"
                                value={formData.daily_calories}
                                onChangeText={(text) => setFormData({...formData, daily_calories: text})}
                                mode="outlined"
                                keyboardType="numeric"
                                style={[styles.input, styles.halfInput]}
                            />

                            <TextInput
                                label="Thời gian (tuần)"
                                value={formData.duration}
                                onChangeText={(text) => setFormData({...formData, duration: text})}
                                mode="outlined"
                                keyboardType="numeric"
                                style={[styles.input, styles.halfInput]}
                            />
                        </View>

                        {/* Calories Summary */}
                        <View style={styles.caloriesSummary}>
                            <View style={styles.caloriesItem}>
                                <Text style={styles.caloriesLabel}>Đã chọn:</Text>
                                <Text style={styles.caloriesValue}>{totalCalories} cal</Text>
                            </View>
                            <View style={styles.caloriesItem}>
                                <Text style={styles.caloriesLabel}>Mục tiêu:</Text>
                                <Text style={styles.caloriesValue}>{formData.daily_calories} cal</Text>
                            </View>
                            {caloriesDiff !== 0 && (
                                <View style={styles.caloriesItem}>
                                    <Text style={styles.caloriesLabel}>Chênh lệch:</Text>
                                    <Text style={[
                                        styles.caloriesValue,
                                        { color: caloriesDiff > 0 ? '#f44336' : '#4caf50' }
                                    ]}>
                                        {caloriesDiff > 0 ? '+' : ''}{caloriesDiff} cal
                                    </Text>
                                </View>
                            )}
                        </View>
                    </Card.Content>
                </Card>

                {/* Food Selection */}
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.foodHeader}>
                            <Text style={styles.sectionTitle}>Chọn món ăn</Text>
                            <Chip style={styles.countChip}>
                                {selectedFoods.length} đã chọn
                            </Chip>
                        </View>

                        <Text style={styles.recommendedLabel}>
                            💡 Gợi ý dựa trên mục tiêu của bạn
                        </Text>

                        <View style={styles.foodList}>
                            {recommendedFoods.map((food) => {
                                const isSelected = selectedFoods.find(f => f.id === food.id);
                                return (
                                    <TouchableOpacity
                                        key={food.id}
                                        style={[
                                            styles.foodItem,
                                            isSelected && styles.foodItemSelected
                                        ]}
                                        onPress={() => toggleFood(food)}
                                    >
                                        <View style={styles.foodInfo}>
                                            <Text style={styles.foodName}>
                                                {isSelected ? '✅ ' : ''}{food.name}
                                            </Text>
                                            <Text style={styles.foodMeal}>
                                                {getMealTypeIcon(food.meal_type)} {food.meal_type_display || food.meal_type}
                                            </Text>
                                            <Text style={styles.foodNutrition}>
                                                🔥 {food.calories}cal | 💪 {food.protein}g protein
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </Card.Content>
                </Card>

                {/* Save Button */}
                <Button
                    mode="contained"
                    onPress={handleSave}
                    loading={saving}
                    disabled={saving}
                    style={styles.saveButton}
                    icon="content-save"
                >
                    Tạo kế hoạch
                </Button>
            </ScrollView>
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#3b5998',
        padding: 15,
        paddingTop: 50,
    },
    backButton: {
        padding: 5,
    },
    backIcon: {
        fontSize: 28,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    placeholder: {
        width: 38,
    },
    content: {
        flex: 1,
    },
    card: {
        margin: 15,
        marginBottom: 0,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    modeButtons: {
        flexDirection: 'row',
        gap: 10,
    },
    modeButton: {
        flex: 1,
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    modeButtonActive: {
        backgroundColor: '#fff3e0',
        borderColor: '#ff9800',
    },
    modeIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    modeText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    modeTextActive: {
        color: '#ff9800',
    },
    radioItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 5,
    },
    radioLabel: {
        fontSize: 15,
        color: '#333',
        marginLeft: 8,
    },
    templateButton: {
        marginTop: 15,
        borderColor: '#ff9800',
    },
    input: {
        marginBottom: 15,
    },
    rowInputs: {
        flexDirection: 'row',
        gap: 10,
    },
    halfInput: {
        flex: 1,
    },
    caloriesSummary: {
        backgroundColor: '#fff3e0',
        padding: 15,
        borderRadius: 10,
        gap: 10,
    },
    caloriesItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    caloriesLabel: {
        fontSize: 14,
        color: '#666',
    },
    caloriesValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ff9800',
    },
    foodHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    countChip: {
        backgroundColor: '#4caf50',
    },
    recommendedLabel: {
        fontSize: 13,
        color: '#666',
        marginBottom: 15,
        fontStyle: 'italic',
    },
    foodList: {
        gap: 10,
    },
    foodItem: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#f5f5f5',
        borderWidth: 2,
        borderColor: '#e0e0e0',
    },
    foodItemSelected: {
        backgroundColor: '#fff3e0',
        borderColor: '#ff9800',
    },
    foodInfo: {
        flex: 1,
    },
    foodName: {
        fontSize: 15,
        fontWeight: '600',
        color: '#333',
        marginBottom: 5,
    },
    foodMeal: {
        fontSize: 13,
        color: '#666',
        marginBottom: 5,
    },
    foodNutrition: {
        fontSize: 12,
        color: '#666',
    },
    saveButton: {
        margin: 20,
        paddingVertical: 8,
        backgroundColor: '#ff9800',
    },
});

export default CreateNutritionPlan;