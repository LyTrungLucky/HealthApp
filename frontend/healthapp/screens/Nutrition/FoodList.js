// screens/Nutrition/FoodList.js
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from "react-native";
import { Searchbar, Chip, ActivityIndicator } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const FoodList = () => {
    const [foods, setFoods] = useState([]);
    const [selectedMealType, setSelectedMealType] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const nav = useNavigation();

    const mealTypes = [
        { value: null, label: 'Tất cả', icon: '🍽️' },
        { value: 'breakfast', label: 'Sáng', icon: '🌅' },
        { value: 'lunch', label: 'Trưa', icon: '☀️' },
        { value: 'dinner', label: 'Tối', icon: '🌙' },
        { value: 'snack', label: 'Phụ', icon: '🍎' },
    ];

    const loadData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                let params = {};
                if (selectedMealType) params.meal_type = selectedMealType;
                if (searchQuery) params.search = searchQuery;

                const res = await authApis(token).get(endpoints['foods'], { params });
                setFoods(res.data);
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
    }, [selectedMealType, searchQuery]);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const renderFood = ({ item }) => (
        <TouchableOpacity 
            style={styles.foodCard}
            onPress={() => nav.navigate('FoodDetail', { foodId: item.id })}
        >
            <Image 
                source={item.image ? { uri: item.image } : require('../../assets/icon.png')}
                style={styles.foodImage}
            />
            <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.mealType}>{item.meal_type_display || item.meal_type}</Text>
                
                <View style={styles.nutritionRow}>
                    <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{item.calories}</Text>
                        <Text style={styles.nutritionLabel}>cal</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{item.protein}g</Text>
                        <Text style={styles.nutritionLabel}>protein</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{item.carbs}g</Text>
                        <Text style={styles.nutritionLabel}>carbs</Text>
                    </View>
                    <View style={styles.nutritionItem}>
                        <Text style={styles.nutritionValue}>{item.fat}g</Text>
                        <Text style={styles.nutritionLabel}>fat</Text>
                    </View>
                </View>
            </View>
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
                <Text style={styles.headerTitle}>Thực Đơn Dinh Dưỡng</Text>
            </View>

            {/* Search */}
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Tìm món ăn..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>

            {/* Meal Types */}
            <View style={styles.mealTypesContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={mealTypes}
                    keyExtractor={(item) => item.value?.toString() || 'all'}
                    renderItem={({ item }) => (
                        <Chip
                            selected={selectedMealType === item.value}
                            onPress={() => setSelectedMealType(item.value)}
                            style={styles.mealTypeChip}
                            textStyle={styles.mealTypeText}
                        >
                            {item.icon} {item.label}
                        </Chip>
                    )}
                />
            </View>

            {/* Food List */}
            <FlatList
                data={foods}
                renderItem={renderFood}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Không có món ăn nào</Text>
                    </View>
                }
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
    searchContainer: {
        padding: 15,
        backgroundColor: '#ffffff',
    },
    searchBar: {
        elevation: 0,
        backgroundColor: '#f5f5f5',
    },
    mealTypesContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
    },
    mealTypeChip: {
        marginRight: 8,
    },
    mealTypeText: {
        fontSize: 14,
    },
    listContainer: {
        padding: 15,
    },
    foodCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 2,
    },
    foodImage: {
        width: 120,
        height: 120,
        backgroundColor: '#e0e0e0',
    },
    foodInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    foodName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    mealType: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    nutritionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    nutritionItem: {
        alignItems: 'center',
    },
    nutritionValue: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#3b5998',
    },
    nutritionLabel: {
        fontSize: 10,
        color: '#999',
        marginTop: 2,
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});

export default FoodList;