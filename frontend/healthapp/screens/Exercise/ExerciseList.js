
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, RefreshControl } from "react-native";
import { Searchbar, Card, Chip, ActivityIndicator } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const ExerciseList = () => {
    const [exercises, setExercises] = useState([]);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const nav = useNavigation();

    const loadData = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                
                const catRes = await authApis(token).get(endpoints['exercise_categories']);
                setCategories(catRes.data);

               
                let params = {};
                if (selectedCategory) params.category_id = selectedCategory;
                if (searchQuery) params.search = searchQuery;

                const exRes = await authApis(token).get(endpoints['exercises'], { params });
                setExercises(exRes.data);
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
    }, [selectedCategory, searchQuery]);

    const onRefresh = () => {
        setRefreshing(true);
        loadData();
    };

    const getDifficultyColor = (difficulty) => {
        switch(difficulty) {
            case 'easy': return '#4caf50';
            case 'medium': return '#ff9800';
            case 'hard': return '#f44336';
            default: return '#666';
        }
    };

    const getDifficultyText = (difficulty) => {
        switch(difficulty) {
            case 'easy': return 'Dễ';
            case 'medium': return 'TB';
            case 'hard': return 'Khó';
            default: return '';
        }
    };

    const renderExercise = ({ item }) => (
        <TouchableOpacity 
            style={styles.exerciseCard}
            onPress={() => nav.navigate('ExerciseDetail', { exerciseId: item.id })}
        >
            <Image 
                source={item.image ? { uri: item.image } : require('../../assets/icon.png')}
                style={styles.exerciseImage}
            />
            <View style={styles.exerciseInfo}>
                <Text style={styles.exerciseName}>{item.name}</Text>
                <Text style={styles.exerciseCategory}>{item.category?.name || 'N/A'}</Text>
                
                <View style={styles.exerciseMeta}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaIcon}>⏱️</Text>
                        <Text style={styles.metaText}>{item.duration} phút</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaIcon}>🔥</Text>
                        <Text style={styles.metaText}>{item.calories_burned} cal</Text>
                    </View>
                    <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(item.difficulty) }]}>
                        <Text style={styles.difficultyText}>{getDifficultyText(item.difficulty)}</Text>
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
                <Text style={styles.headerTitle}>Bài Tập</Text>
            </View>

           
            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Tìm bài tập..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>

            
            <View style={styles.categoriesContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={[{ id: null, name: 'Tất cả' }, ...categories]}
                    keyExtractor={(item) => item.id?.toString() || 'all'}
                    renderItem={({ item }) => (
                        <Chip
                            selected={selectedCategory === item.id}
                            onPress={() => setSelectedCategory(item.id)}
                            style={styles.categoryChip}
                            textStyle={styles.categoryText}
                        >
                            {item.name}
                        </Chip>
                    )}
                />
            </View>

            
            <FlatList
                data={exercises}
                renderItem={renderExercise}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Không có bài tập nào</Text>
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
    categoriesContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
    },
    categoryChip: {
        marginRight: 8,
    },
    categoryText: {
        fontSize: 14,
    },
    listContainer: {
        padding: 15,
    },
    exerciseCard: {
        flexDirection: 'row',
        backgroundColor: '#ffffff',
        borderRadius: 12,
        marginBottom: 15,
        overflow: 'hidden',
        elevation: 2,
    },
    exerciseImage: {
        width: 120,
        height: 120,
        backgroundColor: '#e0e0e0',
    },
    exerciseInfo: {
        flex: 1,
        padding: 12,
        justifyContent: 'space-between',
    },
    exerciseName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    exerciseCategory: {
        fontSize: 13,
        color: '#666',
        marginBottom: 8,
    },
    exerciseMeta: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 15,
    },
    metaIcon: {
        fontSize: 14,
        marginRight: 4,
    },
    metaText: {
        fontSize: 13,
        color: '#666',
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 12,
        marginLeft: 'auto',
    },
    difficultyText: {
        fontSize: 11,
        color: '#ffffff',
        fontWeight: 'bold',
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

export default ExerciseList;