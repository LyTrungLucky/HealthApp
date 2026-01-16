import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl } from "react-native";
import { Searchbar, Card, Chip, ActivityIndicator } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints, BASE_URL } from "../../utils/Apis";
import styles from "../../styles/screens/Exercise/ExerciseListStyles";

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

    const getImageUri = (item) => {
        if (!item) return null;
        const imgCandidates = [];
        if (item.image_url) imgCandidates.push(item.image_url);
        if (item.image) {
            if (typeof item.image === 'string' && item.image.trim() !== '') imgCandidates.push(item.image);
            if (typeof item.image === 'object') {
                if (item.image.url) imgCandidates.push(item.image.url);
                if (item.image.secure_url) imgCandidates.push(item.image.secure_url);
                if (item.image.file && item.image.file.url) imgCandidates.push(item.image.file.url);
            }
        }

        for (const candidate of imgCandidates) {
            if (!candidate) continue;
            const s = String(candidate).trim();
            if (s === '') continue;
            if (s.startsWith('http://') || s.startsWith('https://')) return s;
            if (s.startsWith('/')) return BASE_URL.replace(/\/$/, '') + s;

            return BASE_URL.replace(/\/$/, '') + '/' + s;
        }
        return null;
    };

    const renderExercise = ({ item }) => (
        <TouchableOpacity 
            style={styles.exerciseCard}
            onPress={() => nav.navigate('ExerciseDetail', { exerciseId: item.id })}
        >
            <Image 
                source={getImageUri(item) ? { uri: getImageUri(item) } : require('../../assets/icon.png')}
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

export default ExerciseList;