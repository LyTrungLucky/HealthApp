import { View, Text, ScrollView, Image, TouchableOpacity, Linking, Alert } from "react-native";
import { Button, ActivityIndicator, Chip, Portal, Dialog, RadioButton, TextInput } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import { Video } from 'expo-av';
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints, BASE_URL } from "../../utils/Apis";
import styles from "../../styles/screens/Exercise/ExerciseDetailStyles";

const ExerciseDetail = () => {
    const [exercise, setExercise] = useState(null);
    const [loading, setLoading] = useState(true);
    const [plans, setPlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [selectedWeekday, setSelectedWeekday] = useState(0);
    const [setsCount, setSetsCount] = useState('3');
    const [repsCount, setRepsCount] = useState('10');
    const route = useRoute();
    const nav = useNavigation();
    const { exerciseId } = route.params;

    useEffect(() => {
        loadExercise();
    }, []);

    useEffect(() => {
        loadPlans();
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

    const loadPlans = async () => {
        setPlansLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const res = await authApis(token).get(endpoints['workout_plans']);
                setPlans(res.data);
            }
        } catch (error) {
            console.error('Load plans error', error);
        } finally {
            setPlansLoading(false);
        }
    };

    const getVideoUrl = () => {
        if (!exercise) return null;
        // Support multiple backend shapes:
        // - exercise.video as string (direct URL)
        // - exercise.video as object with { url } or { file }
        // - legacy exercise.video_url string
        if (exercise.video) {
            if (typeof exercise.video === 'string' && exercise.video.trim() !== '') return exercise.video;
            if (typeof exercise.video === 'object') {
                if (exercise.video.url) return exercise.video.url;
                if (exercise.video.file) return exercise.video.file;
            }
        }
        if (exercise.video_url) return exercise.video_url;
        return null;
    };

    const openVideo = () => {
        const url = getVideoUrl();
        if (url) {
            Linking.openURL(url);
        } else {
            Alert.alert('Không có video', 'Bài tập này chưa có video hướng dẫn');
        }
    };

    const videoRef = useRef(null);

    const getImageUri = () => {
        if (!exercise) return null;
        // handle several shapes: string, object with .url/secure_url, nested file, or separate image_url
        const imgCandidates = [];
        if (exercise.image_url) imgCandidates.push(exercise.image_url);
        if (exercise.image) {
            if (typeof exercise.image === 'string' && exercise.image.trim() !== '') imgCandidates.push(exercise.image);
            if (typeof exercise.image === 'object') {
                if (exercise.image.url) imgCandidates.push(exercise.image.url);
                if (exercise.image.secure_url) imgCandidates.push(exercise.image.secure_url);
                if (exercise.image.file && exercise.image.file.url) imgCandidates.push(exercise.image.file.url);
            }
        }

        for (const candidate of imgCandidates) {
            if (!candidate) continue;
            const s = String(candidate).trim();
            if (s === '') continue;
            // absolute URL
            if (s.startsWith('http://') || s.startsWith('https://')) return s;
            // relative path starting with / -> prefix BASE_URL
            if (s.startsWith('/')) return BASE_URL.replace(/\/$/, '') + s;
            // relative path without leading slash (Cloudinary sometimes returns "image/upload/...")
            return BASE_URL.replace(/\/$/, '') + '/' + s;
        }

        return null;
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

    const handleAddToPlan = () => {
        if (plansLoading) {
            Alert.alert('Vui lòng chờ', 'Đang tải kế hoạch...');
            return;
        }

        if (!plans || plans.length === 0) {
            Alert.alert(
                'Chưa có kế hoạch',
                'Bạn chưa có kế hoạch tập luyện nào. Muốn tạo mới?'
            , [
                { text: 'Hủy', style: 'cancel' },
                { text: 'Tạo', onPress: () => nav.navigate('Plans', { screen: 'CreateWorkoutPlan' }) }
            ]);
            return;
        }

        const buttons = plans.slice(0,3).map(p => ({ text: p.name, onPress: () => openPlanDialog(p.id) }));
        buttons.push({ text: 'Hủy', style: 'cancel' });
        Alert.alert('Chọn kế hoạch', 'Chọn kế hoạch để thêm bài tập', buttons);
    };

    const openPlanDialog = (planId) => {
        setSelectedPlanId(planId);
        setSelectedWeekday(0);
        setSetsCount('3');
        setRepsCount('10');
        setDialogVisible(true);
    };

    const confirmAdd = async () => {
        setDialogVisible(false);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) { Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để thêm bài tập'); return; }

            await authApis(token).post(endpoints['add_exercise_to_plan'](selectedPlanId), {
                exercise_id: exercise.id,
                weekday: selectedWeekday,
                sets: parseInt(setsCount,10) || 3,
                reps: parseInt(repsCount,10) || 10,
            });

            Alert.alert('Thành công', 'Đã thêm bài tập vào kế hoạch');
        } catch (error) {
            console.error('Add exercise error', error);
            Alert.alert('Lỗi', 'Không thể thêm bài tập vào kế hoạch');
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
            <View style={styles.header}>
                <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết bài tập</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <Image 
                    source={getImageUri() ? { uri: getImageUri() } : require('../../assets/icon.png')}
                    style={styles.exerciseImage}
                />

                <View style={styles.titleSection}>
                    <Text style={styles.exerciseTitle}>{exercise.name}</Text>
                    <Chip style={styles.categoryChip}>{exercise.category?.name || 'N/A'}</Chip>
                </View>

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

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Mô tả</Text>
                    <Text style={styles.description}>{exercise.description}</Text>
                </View>

                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Hướng dẫn thực hiện</Text>
                    <Text style={styles.instructions}>{exercise.instructions}</Text>
                </View>

                {getVideoUrl() ? (
                    <View style={styles.videoContainer}>
                        <Video
                            ref={videoRef}
                            source={{ uri: getVideoUrl() }}
                            useNativeControls
                            resizeMode="contain"
                            style={styles.video}
                        />
                        <Button mode="outlined" icon="open-in-new" onPress={openVideo} style={styles.openExternButton}>
                            Mở ngoài
                        </Button>
                    </View>
                ) : (
                    <View style={{ paddingHorizontal: 20, paddingTop: 10 }}>
                        <Text style={styles.noVideoText}>Không có video hướng dẫn</Text>
                    </View>
                )}

                <Button 
                    mode="outlined" 
                    icon="calendar-plus"
                    onPress={handleAddToPlan}
                    style={styles.addButton}
                >
                    Thêm vào kế hoạch
                </Button>

                <Portal>
                    <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                        <Dialog.Title>Thêm bài tập vào kế hoạch</Dialog.Title>
                        <Dialog.Content>
                            <Text style={{ marginBottom: 8 }}>{exercise ? exercise.name : ''}</Text>
                            <RadioButton.Group onValueChange={v => setSelectedWeekday(parseInt(v,10))} value={String(selectedWeekday)}>
                                <RadioButton.Item label="Thứ 2" value="0" />
                                <RadioButton.Item label="Thứ 3" value="1" />
                                <RadioButton.Item label="Thứ 4" value="2" />
                                <RadioButton.Item label="Thứ 5" value="3" />
                                <RadioButton.Item label="Thứ 6" value="4" />
                                <RadioButton.Item label="Thứ 7" value="5" />
                                <RadioButton.Item label="Chủ nhật" value="6" />
                            </RadioButton.Group>

                            <TextInput label="Sets" value={setsCount} onChangeText={setSetsCount} keyboardType="numeric" style={{ marginTop: 8 }} />
                            <TextInput label="Reps" value={repsCount} onChangeText={setRepsCount} keyboardType="numeric" style={{ marginTop: 8 }} />
                        </Dialog.Content>
                        <Dialog.Actions>
                            <Button onPress={() => setDialogVisible(false)}>Hủy</Button>
                            <Button onPress={confirmAdd}>Thêm</Button>
                        </Dialog.Actions>
                    </Dialog>
                </Portal>
            </ScrollView>
        </View>
    );
};

export default ExerciseDetail;