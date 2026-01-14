
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking, Alert } from "react-native";
import { Button, ActivityIndicator, Chip, Portal, Dialog, RadioButton, TextInput } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

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
                    source={exercise.image ? { uri: exercise.image } : require('../../assets/icon.png')}
                    style={styles.image}
                />

               
                <View style={styles.titleSection}>
                    <Text style={styles.title}>{exercise.name}</Text>
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