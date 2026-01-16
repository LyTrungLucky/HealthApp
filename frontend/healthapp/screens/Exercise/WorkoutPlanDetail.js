import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Card, ActivityIndicator, Chip, Portal, Dialog, RadioButton, TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApis, endpoints } from '../../utils/Apis';
import { useRoute } from '@react-navigation/native';
import styles from '../../styles/screens/Exercise/WorkoutPlanDetailStyles';

const weekdayNames = ['Thứ 2','Thứ 3','Thứ 4','Thứ 5','Thứ 6','Thứ 7','Chủ nhật'];

const WorkoutPlanDetail = () => {
    const route = useRoute();
    const { id } = route.params || {};
    const exerciseToAdd = route.params?.exerciseToAdd || null;
    const nav = useNavigation();

    const [plan, setPlan] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState({});
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedWeekday, setSelectedWeekday] = useState(0);
    const [setsCount, setSetsCount] = useState('3');
    const [repsCount, setRepsCount] = useState('10');

    const loadDetail = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) return;

            const api = authApis(token);
            const [planRes, schedRes] = await Promise.all([
                api.get(endpoints['workout_detail'](id)),
                api.get(endpoints['workout_schedules'](id)),
            ]);

            setPlan(planRes.data);
            setSchedules(schedRes.data);
        } catch (error) {
            console.error('Load workout detail error', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) loadDetail();
        if (exerciseToAdd) {
            setSelectedWeekday(0);
            setSetsCount('3');
            setRepsCount('10');
            setDialogVisible(true);
        }
    }, [id]);

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const renderScheduleItem = (item) => (
        <Card style={styles.scheduleCard} key={String(item.id)}>
            <Card.Content>
                <View style={styles.scheduleHeader}>
                    <Text style={styles.exerciseName}>{item.exercise.name}</Text>
                </View>

                <Text style={styles.meta}>Sets: {item.sets}  •  Reps: {item.reps}</Text>
                {item.notes ? <Text style={styles.notes}>{item.notes}</Text> : null}
            </Card.Content>
        </Card>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#3b5998" />
            </View>
        );
    }

    if (!plan) {
        return (
            <View style={styles.center}>
                <Text>Không tìm thấy kế hoạch</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 60 }}>
            <View style={styles.header}>
                <Text style={styles.title}>{plan.name}</Text>
                <Chip style={styles.goalChip}>{plan.goal}</Chip>
                <Text style={styles.metaText}>{formatDate(plan.start_date)} - {formatDate(plan.end_date)}</Text>
                {plan.created_by && (
                    <Text style={styles.createdBy}>Tạo bởi: {plan.created_by.first_name} {plan.created_by.last_name}</Text>
                )}
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Mô tả</Text>
                <Text style={styles.sectionContent}>{plan.description || 'Không có mô tả'}</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Lịch tập ({schedules.length} bài tập)</Text>

                {weekdayNames.map((dayName, idx) => {
                    const items = schedules.filter(s => s.weekday === idx);
                    if (!items.length) return null;

                    const isOpen = !!expanded[idx];
                    return (
                        <View key={`day-${idx}`} style={styles.dayBlock}>
                            <TouchableOpacity style={styles.weekdayHeader} onPress={() => setExpanded(prev => ({ ...prev, [idx]: !prev[idx] }))}>
                                <Text style={styles.weekdayTitle}>{dayName}</Text>
                                <View style={styles.countBadge}>
                                    <Text style={styles.countText}>{items.length}</Text>
                                </View>
                            </TouchableOpacity>

                            {isOpen && (
                                <View style={styles.dayItems}>
                                    {items.map(renderScheduleItem)}
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={() => { setDialogVisible(false); try { nav.setParams({ exerciseToAdd: null }); } catch(e){} }}>
                    <Dialog.Title>Thêm bài tập vào kế hoạch</Dialog.Title>
                    <Dialog.Content>
                        <Text style={{ marginBottom: 8 }}>{exerciseToAdd ? exerciseToAdd.name : ''}</Text>
                        <RadioButton.Group onValueChange={v => setSelectedWeekday(parseInt(v, 10))} value={String(selectedWeekday)}>
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
                        <Button onPress={() => { setDialogVisible(false); try { nav.setParams({ exerciseToAdd: null }); } catch(e){} }}>Hủy</Button>
                        <Button onPress={async () => {
                            setDialogVisible(false);
                            try {
                                const token = await AsyncStorage.getItem('token');
                                if (!token) { Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để thêm bài tập'); return; }
                                await authApis(token).post(endpoints['add_exercise_to_plan'](id), {
                                    exercise_id: exerciseToAdd.id,
                                    weekday: selectedWeekday,
                                    sets: parseInt(setsCount,10) || 3,
                                    reps: parseInt(repsCount,10) || 10,
                                });
                                Alert.alert('Thành công', 'Đã thêm bài tập vào kế hoạch');
                                try { nav.setParams({ exerciseToAdd: null }); } catch(e){}
                                loadDetail();
                            } catch (error) {
                                console.error('Add exercise error', error);
                                Alert.alert('Lỗi', 'Không thể thêm bài tập vào kế hoạch');
                            }
                        }}>Thêm</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </ScrollView>
    );
};

export default WorkoutPlanDetail;
