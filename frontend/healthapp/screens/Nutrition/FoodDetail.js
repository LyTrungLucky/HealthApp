// screens/Nutrition/FoodDetail.js
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { Button, ActivityIndicator, Chip } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const FoodDetail = () => {
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const nav = useNavigation();
    const { foodId } = route.params;

    useEffect(() => {
        loadFood();
    }, []);

    const loadFood = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const res = await authApis(token).get(endpoints['food_detail'](foodId));
                setFood(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b5998" />
            </View>
        );
    }

    if (!food) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Không tìm thấy món ăn</Text>
                <Button mode="contained" onPress={() => nav.goBack()}>
                    Quay lại
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết món ăn</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {/* Image */}
                <Image 
                    source={food.image ? { uri: food.image } : require('../../assets/icon.png')}
                    style={styles.image}
                />

                {/* Title & Meal Type */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>{food.name}</Text>
                    <Chip style={styles.mealTypeChip}>
                        {food.meal_type_display || food.meal_type}
                    </Chip>
                </View>

                {/* Nutrition Stats */}
                <View style={styles.nutritionContainer}>
                    <View style={styles.calorieBox}>
                        <Text style={styles.calorieValue}>{food.calories}</Text>
                        <Text style={styles.calorieLabel}>Calories</Text>
                    </View>
                    
                    <View style={styles.macrosContainer}>
                        <View style={styles.macroBox}>
                            <View style={[styles.macroBar, { backgroundColor: '#4caf50', width: '80%' }]} />
                            <Text style={styles.macroValue}>{food.protein}g</Text>
                            <Text style={styles.macroLabel}>Protein</Text>
                        </View>
                        <View style={styles.macroBox}>
                            <View style={[styles.macroBar, { backgroundColor: '#ff9800', width: '60%' }]} />
                            <Text style={styles.macroValue}>{food.carbs}g</Text>
                            <Text style={styles.macroLabel}>Carbs</Text>
                        </View>
                        <View style={styles.macroBox}>
                            <View style={[styles.macroBar, { backgroundColor: '#f44336', width: '40%' }]} />
                            <Text style={styles.macroValue}>{food.fat}g</Text>
                            <Text style={styles.macroLabel}>Fat</Text>
                        </View>
                    </View>
                </View>

                {/* Description */}
                {food.description && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Mô tả</Text>
                        <Text style={styles.description}>{food.description}</Text>
                    </View>
                )}

                {/* Recipe */}
                {food.recipe && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Công thức</Text>
                        <Text style={styles.recipe}>{food.recipe}</Text>
                    </View>
                )}

                {/* Add to Plan Button */}
                <Button 
                    mode="contained" 
                    icon="calendar-plus"
                    onPress={() => nav.navigate('Plans', { screen: 'NutritionPlan', params: { foodToAdd: food } })}
                    style={styles.addButton}
                >
                    Thêm vào kế hoạch dinh dưỡng
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
    image: {
        width: '100%',
        height: 250,
        backgroundColor: '#e0e0e0',
    },
    titleSection: {
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    mealTypeChip: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff3e0',
    },
    nutritionContainer: {
        backgroundColor: '#ffffff',
        padding: 20,
        marginTop: 10,
    },
    calorieBox: {
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 20,
    },
    calorieValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#3b5998',
    },
    calorieLabel: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    macrosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    macroBox: {
        alignItems: 'center',
        flex: 1,
    },
    macroBar: {
        height: 6,
        borderRadius: 3,
        marginBottom: 8,
        alignSelf: 'stretch',
    },
    macroValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    macroLabel: {
        fontSize: 12,
        color: '#999',
    },
    section: {
        backgroundColor: '#ffffff',
        padding: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 24,
    },
    recipe: {
        fontSize: 15,
        color: '#666',
        lineHeight: 24,
    },
    addButton: {
        margin: 20,
        marginBottom: 30,
        backgroundColor: '#4caf50',
    },
});

export default FoodDetail;