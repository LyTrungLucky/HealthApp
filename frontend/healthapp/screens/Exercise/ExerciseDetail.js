// screens/Exercise/ExerciseDetail.js
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from "react-native";
import { Button, ActivityIndicator, Chip } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const ExerciseDetail = () => {
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const route = useRoute();
    const nav = useNavigation();
    const { exerciseId } = route.params;

    useEffect(() => {
        loadExercise();
    }, []);

    const loadExercise = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const res = await authApis(token).get(endpoints['exercise_detail'](exerciseId));
                setExercise(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const openVideo = () => {
        if (exercise?.video_url) {
            Linking.openURL(exercise.video_url);
        }
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
            case 'medium': return 'Trung bình';
            case 'hard': return 'Khó';
            default: return '';
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b5998" />
            </View>
        );
    }

    if (!exercise) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Không tìm thấy bài tập</Text>
                <Button mode="contained" onPress={() => nav.goBack()}>
                    Quay lại
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header with Back Button */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết bài tập</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {/* Image */}
                <Image 
                    source={exercise.image ? { uri: exercise.image } : require('../../assets/icon.png')}
                    style={styles.image}
                />

                {/* Title & Category */}
                <View style={styles.titleSection}>
                    <Text style={styles.title}>{exercise.name}</Text>
                    <Chip style={styles.categoryChip}>{exercise.category?.name || 'N/A'}</Chip>
                </View>

                {/* Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statIcon}>⏱️</Text>
                        <Text style={styles.statValue}>{exercise.duration}</Text>
                        <Text style={styles.statLabel}>Phút</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statIcon}>🔥</Text>
                        <Text style={styles.statValue}>{exercise.calories_burned}</Text>
                        <Text style={styles.statLabel}>Calories</Text>
                    </View>
                    <View style={styles.statBox}>
                        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(exercise.difficulty) }]}>
                            <Text style={styles.difficultyText}>{getDifficultyText(exercise.difficulty)}</Text>
                        </View>
                        <Text style={styles.statLabel}>Độ khó</Text>
                    </View>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mô tả</Text>
                    <Text style={styles.description}>{exercise.description}</Text>
                </View>

                {/* Instructions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hướng dẫn thực hiện</Text>
                    <Text style={styles.instructions}>{exercise.instructions}</Text>
                </View>

                {/* Video Button */}
                {exercise.video_url && (
                    <Button 
                        mode="contained" 
                        icon="play-circle"
                        onPress={openVideo}
                        style={styles.videoButton}
                    >
                        Xem video hướng dẫn
                    </Button>
                )}

                {/* Add to Plan Button */}
                <Button 
                    mode="outlined" 
                    icon="calendar-plus"
                    onPress={() => nav.navigate('Plans', { screen: 'WorkoutPlan', params: { exerciseToAdd: exercise } })}
                    style={styles.addButton}
                >
                    Thêm vào kế hoạch
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
    categoryChip: {
        alignSelf: 'flex-start',
        backgroundColor: '#e3f2fd',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 20,
        backgroundColor: '#ffffff',
        marginTop: 10,
    },
    statBox: {
        alignItems: 'center',
    },
    statIcon: {
        fontSize: 32,
        marginBottom: 5,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#3b5998',
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    difficultyBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 5,
    },
    difficultyText: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: 'bold',
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
    instructions: {
        fontSize: 15,
        color: '#666',
        lineHeight: 24,
    },
    videoButton: {
        margin: 20,
        marginBottom: 10,
        backgroundColor: '#f44336',
    },
    addButton: {
        margin: 20,
        marginTop: 0,
        marginBottom: 30,
        borderColor: '#3b5998',
    },
});

export default ExerciseDetail;