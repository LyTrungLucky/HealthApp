// screens/Exercise/CreateWorkoutPlan.js - ĐÃ SỬA ĐỂ DÙNG BACKEND TEMPLATES
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button, RadioButton, Card, Chip, ActivityIndicator } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const CreateWorkoutPlan = () => {
    const [healthProfile, setHealthProfile] = useState(null);
    const [templates, setTemplates] = useState([]);
    const [recommendedExercises, setRecommendedExercises] = useState([]);
    const [selectedExercises, setSelectedExercises] = useState([]);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [mode, setMode] = useState('template');
    
    const [formData, setFormData] = useState({
        name: '',
        goal: 'maintain',
        description: '',
        duration: '4',
    });

    const nav = useNavigation();

    const goalOptions = [
        { value: 'lose_weight', label: '🔥 Giảm cân', color: '#f44336' },
        { value: 'gain_muscle', label: '💪 Tăng cơ', color: '#4caf50' },
        { value: 'maintain', label: '🎯 Duy trì', color: '#2196f3' },
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
                setFormData({
                    ...formData,
                    goal: profileRes.data.goal,
                });

                const exercisesRes = await authApis(token).get(endpoints['recommended_exercises']);
                setRecommendedExercises(exercisesRes.data);
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
                const res = await authApis(token).get(endpoints['workout_templates'], {
                    params: { goal: formData.goal }
                });
                setTemplates(res.data);
            }
        } catch (error) {
            console.error('Error loading templates:', error);
        }
    };

    const handleSelectTemplate = async (template) => {
        setSelectedTemplate(template);
        setFormData({
            ...formData,
            name: template.name,
            description: template.description,
        });

        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const schedulesRes = await authApis(token).get(endpoints['workout_schedules'](template.id));
                const exerciseIds = schedulesRes.data.map(s => s.exercise.id);
                const selected = recommendedExercises.filter(ex => exerciseIds.includes(ex.id));
                setSelectedExercises(selected);
                
                Alert.alert(
                    "Kế hoạch mẫu",
                    `Đã chọn: ${template.name}\n${selected.length} bài tập đã được thêm tự động.`
                );
            }
        } catch (error) {
            console.error('Error loading template schedules:', error);
        }
    };

    const handleCloneTemplate = async (templateId) => {
        setSaving(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                await authApis(token).post(endpoints['clone_workout_plan'](templateId));
                
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

    const toggleExercise = (exercise) => {
        const isSelected = selectedExercises.find(ex => ex.id === exercise.id);
        if (isSelected) {
            setSelectedExercises(selectedExercises.filter(ex => ex.id !== exercise.id));
        } else {
            setSelectedExercises([...selectedExercises, exercise]);
        }
    };

    const handleSave = async () => {
        if (!formData.name) {
            Alert.alert("Lỗi", "Vui lòng nhập tên kế hoạch!");
            return;
        }

        if (selectedExercises.length === 0) {
            Alert.alert("Lỗi", "Vui lòng chọn ít nhất 1 bài tập!");
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
                    start_date: today.toISOString().split('T')[0],
                    end_date: endDate.toISOString().split('T')[0],
                };

                const planRes = await authApis(token).post(endpoints['workout_plans'], planData);
                const planId = planRes.data.id;

                const workoutDays = [0, 2, 4];
                const exercisesPerDay = Math.ceil(selectedExercises.length / 3);

                for (let i = 0; i < selectedExercises.length; i++) {
                    const dayIndex = Math.floor(i / exercisesPerDay);
                    const weekday = workoutDays[dayIndex] || workoutDays[0];
                    
                    const scheduleData = {
                        exercise_id: selectedExercises[i].id,
                        weekday: weekday,
                        sets: 3,
                        reps: 15,
                    };

                    await authApis(token).post(
                        endpoints['add_exercise_to_plan'](planId),
                        scheduleData
                    );
                }

                Alert.alert(
                    "Thành công!",
                    "Kế hoạch tập luyện đã được tạo thành công!",
                    [{ text: "OK", onPress: () => nav.goBack() }]
                );
            }
        } catch (error) {
            console.error('Save error:', error.response?.data || error);
            Alert.alert("Lỗi", `Không thể tạo kế hoạch!\n${error.response?.data?.detail || error.message}`);
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

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tạo kế hoạch tập luyện</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                {/* Mode Selection */}
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Chọn cách tạo kế hoạch</Text>
                        <View style={styles.modeButtons}>
                            <TouchableOpacity
                                style={[styles.modeButton, mode === 'template' && styles.modeButtonActive]}
                                onPress={() => setMode('template')}
                            >
                                <Text style={styles.modeIcon}>📋</Text>
                                <Text style={[styles.modeText, mode === 'template' && styles.modeTextActive]}>
                                    Kế hoạch mẫu
                                </Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={[styles.modeButton, mode === 'custom' && styles.modeButtonActive]}
                                onPress={() => setMode('custom')}
                            >
                                <Text style={styles.modeIcon}>✏️</Text>
                                <Text style={[styles.modeText, mode === 'custom' && styles.modeTextActive]}>
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
                            onValueChange={(value) => setFormData({...formData, goal: value})}
                            value={formData.goal}
                        >
                            {goalOptions.map((option) => (
                                <View key={option.value} style={styles.radioItem}>
                                    <RadioButton value={option.value} />
                                    <Text style={styles.radioLabel}>{option.label}</Text>
                                </View>
                            ))}
                        </RadioButton.Group>
                    </Card.Content>
                </Card>

                {/* Templates List (if template mode) */}
                {mode === 'template' && templates.length > 0 && (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.sectionTitle}>Kế hoạch mẫu có sẵn</Text>
                            {templates.map((template) => (
                                <Card key={template.id} style={styles.templateCard}>
                                    <Card.Content>
                                        <Text style={styles.templateName}>{template.name}</Text>
                                        <Text style={styles.templateDescription}>{template.description}</Text>
                                        <Text style={styles.templateMeta}>
                                            💪 {template.total_exercises || 0} bài tập
                                        </Text>
                                        <View style={styles.templateButtons}>
                                            <Button
                                                mode="outlined"
                                                onPress={() => handleSelectTemplate(template)}
                                                style={styles.templateButton}
                                            >
                                                Chỉnh sửa
                                            </Button>
                                            <Button
                                                mode="contained"
                                                onPress={() => handleCloneTemplate(template.id)}
                                                style={styles.templateButton}
                                                loading={saving}
                                            >
                                                Sao chép
                                            </Button>
                                        </View>
                                    </Card.Content>
                                </Card>
                            ))}
                        </Card.Content>
                    </Card>
                )}

                {/* Plan Details (if custom or after selecting template) */}
                {(mode === 'custom' || selectedTemplate) && (
                    <>
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

                                <TextInput
                                    label="Thời gian (tuần)"
                                    value={formData.duration}
                                    onChangeText={(text) => setFormData({...formData, duration: text})}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    style={styles.input}
                                />
                            </Card.Content>
                        </Card>

                        {/* Exercise Selection */}
                        <Card style={styles.card}>
                            <Card.Content>
                                <View style={styles.exerciseHeader}>
                                    <Text style={styles.sectionTitle}>Chọn bài tập</Text>
                                    <Chip style={styles.countChip}>
                                        {selectedExercises.length} đã chọn
                                    </Chip>
                                </View>

                                <Text style={styles.recommendedLabel}>
                                    💡 Gợi ý dựa trên mục tiêu của bạn
                                </Text>

                                <View style={styles.exerciseList}>
                                    {recommendedExercises.map((exercise) => {
                                        const isSelected = selectedExercises.find(ex => ex.id === exercise.id);
                                        return (
                                            <TouchableOpacity
                                                key={exercise.id}
                                                style={[
                                                    styles.exerciseItem,
                                                    isSelected && styles.exerciseItemSelected
                                                ]}
                                                onPress={() => toggleExercise(exercise)}
                                            >
                                                <View style={styles.exerciseInfo}>
                                                    <Text style={styles.exerciseName}>
                                                        {isSelected ? '✅ ' : ''}{exercise.name}
                                                    </Text>
                                                    <Text style={styles.exerciseMeta}>
                                                        ⏱️ {exercise.duration}min | 🔥 {exercise.calories_burned}cal
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            </Card.Content>
                        </Card>

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
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    errorText: { fontSize: 16, color: '#666', marginBottom: 20, textAlign: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#3b5998', padding: 15, paddingTop: 50 },
    backButton: { padding: 5 },
    backIcon: { fontSize: 28, color: '#ffffff', fontWeight: 'bold' },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#ffffff' },
    placeholder: { width: 38 },
    content: { flex: 1 },
    card: { margin: 15, marginBottom: 0, elevation: 2 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
    modeButtons: { flexDirection: 'row', gap: 10 },
    modeButton: { flex: 1, padding: 20, borderRadius: 12, backgroundColor: '#f5f5f5', alignItems: 'center', borderWidth: 2, borderColor: '#e0e0e0' },
    modeButtonActive: { backgroundColor: '#e3f2fd', borderColor: '#3b5998' },
    modeIcon: { fontSize: 32, marginBottom: 8 },
    modeText: { fontSize: 14, fontWeight: '600', color: '#666' },
    modeTextActive: { color: '#3b5998' },
    radioItem: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
    radioLabel: { fontSize: 15, color: '#333', marginLeft: 8 },
    templateCard: { marginBottom: 15, backgroundColor: '#f8f8f8' },
    templateName: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 5 },
    templateDescription: { fontSize: 14, color: '#666', marginBottom: 10 },
    templateMeta: { fontSize: 13, color: '#666', marginBottom: 10 },
    templateButtons: { flexDirection: 'row', gap: 10 },
    templateButton: { flex: 1 },
    input: { marginBottom: 15 },
    exerciseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    countChip: { backgroundColor: '#4caf50' },
    recommendedLabel: { fontSize: 13, color: '#666', marginBottom: 15, fontStyle: 'italic' },
    exerciseList: { gap: 10 },
    exerciseItem: { padding: 15, borderRadius: 10, backgroundColor: '#f5f5f5', borderWidth: 2, borderColor: '#e0e0e0' },
    exerciseItemSelected: { backgroundColor: '#e8f5e9', borderColor: '#4caf50' },
    exerciseInfo: { flex: 1 },
    exerciseName: { fontSize: 15, fontWeight: '600', color: '#333', marginBottom: 5 },
    exerciseMeta: { fontSize: 12, color: '#666' },
    saveButton: { margin: 20, paddingVertical: 8, backgroundColor: '#4caf50' },
});

export default CreateWorkoutPlan;