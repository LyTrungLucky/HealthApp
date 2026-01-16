import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button, Card } from "react-native-paper";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";
import styles from "../../styles/screens/Reminder/CreateReminderStyles";

const CreateReminder = () => {
    const [formData, setFormData] = useState({
        title: '',
        reminder_type: 'water',
        time: '08:00',
        days_of_week: [0, 1, 2, 3, 4], 
        message: '',
    });
    const [saving, setSaving] = useState(false);
    const nav = useNavigation();

    const reminderTypes = [
        { value: 'water', label: '💧 Uống nước' },
        { value: 'exercise', label: '🏃 Tập luyện' },
        { value: 'rest', label: '😴 Nghỉ ngơi' },
        { value: 'meal', label: '🍽️ Bữa ăn' },
        { value: 'medicine', label: '💊 Uống thuốc' },
    ];

    const daysOfWeek = [
        { value: 0, label: 'T2' },
        { value: 1, label: 'T3' },
        { value: 2, label: 'T4' },
        { value: 3, label: 'T5' },
        { value: 4, label: 'T6' },
        { value: 5, label: 'T7' },
        { value: 6, label: 'CN' },
    ];

    const toggleDay = (day) => {
        if (formData.days_of_week.includes(day)) {
            setFormData({
                ...formData,
                days_of_week: formData.days_of_week.filter(d => d !== day)
            });
        } else {
            setFormData({
                ...formData,
                days_of_week: [...formData.days_of_week, day].sort()
            });
        }
    };

    const handleSave = async () => {
        if (!formData.title) {
            Alert.alert("Lỗi", "Vui lòng nhập tiêu đề!");
            return;
        }

        if (formData.days_of_week.length === 0) {
            Alert.alert("Lỗi", "Vui lòng chọn ít nhất 1 ngày!");
            return;
        }

        setSaving(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                await authApis(token).post(endpoints['reminders'], formData);
                Alert.alert(
                    "Thành công!",
                    "Đã tạo nhắc nhở mới!",
                    [{ text: "OK", onPress: () => nav.goBack() }]
                );
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Không thể tạo nhắc nhở!");
        } finally {
            setSaving(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Tạo nhắc nhở</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Loại nhắc nhở</Text>
                        <View style={styles.typeGrid}>
                            {reminderTypes.map((type) => (
                                <TouchableOpacity
                                    key={type.value}
                                    style={[
                                        styles.typeButton,
                                        formData.reminder_type === type.value && styles.typeButtonActive
                                    ]}
                                    onPress={() => setFormData({...formData, reminder_type: type.value})}
                                >
                                    <Text style={styles.typeLabel}>{type.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

               
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Thông tin</Text>
                        
                        <TextInput
                            label="Tiêu đề"
                            value={formData.title}
                            onChangeText={(text) => setFormData({...formData, title: text})}
                            mode="outlined"
                            style={styles.input}
                        />

                        <TextInput
                            label="Giờ nhắc (HH:MM)"
                            value={formData.time}
                            onChangeText={(text) => setFormData({...formData, time: text})}
                            mode="outlined"
                            style={styles.input}
                            placeholder="08:00"
                        />

                        <TextInput
                            label="Tin nhắn (tùy chọn)"
                            value={formData.message}
                            onChangeText={(text) => setFormData({...formData, message: text})}
                            mode="outlined"
                            multiline
                            numberOfLines={3}
                            style={styles.input}
                        />
                    </Card.Content>
                </Card>

                
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>Lặp lại vào</Text>
                        <View style={styles.daysGrid}>
                            {daysOfWeek.map((day) => (
                                <TouchableOpacity
                                    key={day.value}
                                    style={[
                                        styles.dayButton,
                                        formData.days_of_week.includes(day.value) && styles.dayButtonActive
                                    ]}
                                    onPress={() => toggleDay(day.value)}
                                >
                                    <Text style={[
                                        styles.dayLabel,
                                        formData.days_of_week.includes(day.value) && styles.dayLabelActive
                                    ]}>
                                        {day.label}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                <Button
                    mode="contained"
                    onPress={handleSave}
                    loading={saving}
                    disabled={saving}
                    style={styles.saveButton}
                    icon="bell-plus"
                >
                    Tạo nhắc nhở
                </Button>
            </ScrollView>
        </View>
    );
};

export default CreateReminder;