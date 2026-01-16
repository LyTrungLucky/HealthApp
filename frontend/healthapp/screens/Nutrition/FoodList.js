import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from "react-native";
import { Searchbar, Chip, ActivityIndicator } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";
import styles from "../../styles/screens/Nutrition/FoodListStyles";

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
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Thực Đơn Dinh Dưỡng</Text>
            </View>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Tìm món ăn..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>

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

export default FoodList;