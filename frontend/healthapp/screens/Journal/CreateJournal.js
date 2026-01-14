import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity, Image } from "react-native";
import { TextInput, Button, Card, Switch, Chip } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";
import * as ImagePicker from 'expo-image-picker';
import moment from "moment";

const CreateJournal = () => {
    const nav = useNavigation();
    const route = useRoute();
    const { journalId } = route.params || {};
    const isEdit = !!journalId;

    const [loading, setLoading] = useState(false);
    const [journal, setJournal] = useState({
        date: moment().format('YYYY-MM-DD'),
        title: '',
        content: '',
        mood: 'normal',
        workout_completed: false,
        workout_notes: '',
        energy_level: 5,
        sleep_hours: 8,
        image: null
    });

    const moodOptions = [
        { key: 'great', emoji: '😄', label: 'Tuyệt vời' },
        { key: 'good', emoji: '😊', label: 'Tốt' },
        { key: 'normal', emoji: '😐', label: 'Bình thường' },
        { key: 'tired', emoji: '😓', label: 'Mệt mỏi' },
        { key: 'bad', emoji: '😢', label: 'Không tốt' }
    ];

    const energyLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    const loadJournal = async () => {
        if (!isEdit) return;

        try {
            const token = await AsyncStorage.getItem('token');
            const res = await authApis(token).get(`${endpoints['health_journals']}${journalId}/`);
            setJournal({
                ...res.data,
                date: moment(res.data.date).format('YYYY-MM-DD')
            });
        } catch (error) {
            console.error('Load journal error:', error);
            Alert.alert('Lỗi', 'Không thể tải thông tin nhật ký');
            nav.goBack();
        }
    };

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Lỗi', 'Cần quyền truy cập thư viện ảnh');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            setJournal({ ...journal, image: result.assets[0].uri });
        }
    };

    const removeImage = () => {
        setJournal({ ...journal, image: null });
    };

    const validate = () => {
        if (!journal.title.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tiêu đề nhật ký');
            return false;
        }
        if (!journal.content.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập nội dung nhật ký');
            return false;
        }
        if (journal.sleep_hours < 0 || journal.sleep_hours > 24) {
            Alert.alert('Lỗi', 'Số giờ ngủ phải từ 0 đến 24');
            return false;
        }
        return true;
    };

    const saveJournal = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const formData = new FormData();

            formData.append('date', journal.date);
            formData.append('title', journal.title);
            formData.append('content', journal.content);
            formData.append('mood', journal.mood);
            formData.append('workout_completed', journal.workout_completed);
            formData.append('workout_notes', journal.workout_notes);
            formData.append('energy_level', journal.energy_level);
            formData.append('sleep_hours', journal.sleep_hours);

            if (journal.image && journal.image.startsWith('file://')) {
                formData.append('image', {
                    uri: journal.image,
                    type: 'image/jpeg',
                    name: 'journal_image.jpg',
                });
            }

            if (isEdit) {
                await authApis(token).put(`${endpoints['health_journals']}${journalId}/`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Alert.alert('Thành công', 'Cập nhật nhật ký thành công');
            } else {
                await authApis(token).post(endpoints['health_journals'], formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                Alert.alert('Thành công', 'Tạo nhật ký thành công');
            }

            nav.goBack();
        } catch (error) {
            console.error('Save journal error:', error);
            Alert.alert('Lỗi', 'Không thể lưu nhật ký');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadJournal();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Quay lại</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {isEdit ? '✏️ Sửa nhật ký' : '📝 Tạo nhật ký mới'}
                </Text>
            </View>

            <ScrollView style={styles.content}>
                
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>📅 Ngày</Text>
                        <TextInput
                            value={moment(journal.date).format('DD/MM/YYYY')}
                            editable={false}
                            style={styles.input}
                            mode="outlined"
                        />
                    </Card.Content>
                </Card>

                
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>📝 Nội dung</Text>
                        <TextInput
                            label="Tiêu đề"
                            value={journal.title}
                            onChangeText={(text) => setJournal({ ...journal, title: text })}
                            style={styles.input}
                            mode="outlined"
                        />
                        <TextInput
                            label="Nội dung nhật ký"
                            value={journal.content}
                            onChangeText={(text) => setJournal({ ...journal, content: text })}
                            multiline
                            numberOfLines={6}
                            style={styles.textArea}
                            mode="outlined"
                        />
                    </Card.Content>
                </Card>

                
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>😊 Tâm trạng</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.moodRow}>
                                {moodOptions.map((mood) => (
                                    <TouchableOpacity
                                        key={mood.key}
                                        onPress={() => setJournal({ ...journal, mood: mood.key })}
                                        style={[
                                            styles.moodButton,
                                            journal.mood === mood.key && styles.selectedMood
                                        ]}
                                    >
                                        <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                                        <Text style={[
                                            styles.moodLabel,
                                            journal.mood === mood.key && styles.selectedMoodLabel
                                        ]}>
                                            {mood.label}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </Card.Content>
                </Card>

                
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>🏃‍♂️ Tập luyện</Text>
                        <View style={styles.switchRow}>
                            <Text style={styles.switchLabel}>Đã tập luyện hôm nay</Text>
                            <Switch
                                value={journal.workout_completed}
                                onValueChange={(value) => setJournal({ ...journal, workout_completed: value })}
                            />
                        </View>
                        {journal.workout_completed && (
                            <TextInput
                                label="Ghi chú về buổi tập"
                                value={journal.workout_notes}
                                onChangeText={(text) => setJournal({ ...journal, workout_notes: text })}
                                multiline
                                numberOfLines={3}
                                style={styles.input}
                                mode="outlined"
                            />
                        )}
                    </Card.Content>
                </Card>

                
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>⚡ Mức năng lượng: {journal.energy_level}/10</Text>
                        <View style={styles.energyRow}>
                            {energyLevels.map((level) => (
                                <TouchableOpacity
                                    key={level}
                                    onPress={() => setJournal({ ...journal, energy_level: level })}
                                    style={[
                                        styles.energyButton,
                                        journal.energy_level === level && styles.selectedEnergy
                                    ]}
                                >
                                    <Text style={[
                                        styles.energyText,
                                        journal.energy_level === level && styles.selectedEnergyText
                                    ]}>
                                        {level}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>😴 Giấc ngủ</Text>
                        <TextInput
                            label="Số giờ ngủ"
                            value={journal.sleep_hours.toString()}
                            onChangeText={(text) => setJournal({ ...journal, sleep_hours: parseFloat(text) || 0 })}
                            keyboardType="numeric"
                            style={styles.input}
                            mode="outlined"
                        />
                    </Card.Content>
                </Card>

                
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>📷 Hình ảnh (tùy chọn)</Text>
                        {journal.image ? (
                            <View style={styles.imageContainer}>
                                <Image source={{ uri: journal.image }} style={styles.image} />
                                <TouchableOpacity onPress={removeImage} style={styles.removeImageButton}>
                                    <Text style={styles.removeImageText}>❌ Xóa ảnh</Text>
                                </TouchableOpacity>
                            </View>
                        ) : (
                            <Button
                                mode="outlined"
                                onPress={pickImage}
                                icon="camera"
                                style={styles.imageButton}
                            >
                                Chọn ảnh
                            </Button>
                        )}
                    </Card.Content>
                </Card>

                
                <Button
                    mode="contained"
                    onPress={saveJournal}
                    loading={loading}
                    disabled={loading}
                    style={styles.saveButton}
                    icon="content-save"
                >
                    {isEdit ? 'Cập nhật nhật ký' : 'Lưu nhật ký'}
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
    header: {
        backgroundColor: '#3b5998',
        padding: 20,
        paddingTop: 50,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 15,
    },
    backText: {
        color: '#ffffff',
        fontSize: 16,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#ffffff',
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    card: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    input: {
        marginBottom: 10,
    },
    textArea: {
        marginBottom: 10,
    },
    moodRow: {
        flexDirection: 'row',
        gap: 10,
    },
    moodButton: {
        alignItems: 'center',
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f0f0f0',
        minWidth: 80,
    },
    selectedMood: {
        backgroundColor: '#3b5998',
    },
    moodEmoji: {
        fontSize: 24,
        marginBottom: 5,
    },
    moodLabel: {
        fontSize: 12,
        color: '#666',
    },
    selectedMoodLabel: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    switchLabel: {
        fontSize: 16,
        color: '#333',
    },
    energyRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    energyButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    selectedEnergy: {
        backgroundColor: '#3b5998',
    },
    energyText: {
        fontSize: 16,
        color: '#666',
        fontWeight: 'bold',
    },
    selectedEnergyText: {
        color: '#ffffff',
    },
    imageContainer: {
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    removeImageButton: {
        padding: 8,
    },
    removeImageText: {
        color: '#f44336',
        fontSize: 14,
    },
    imageButton: {
        borderColor: '#3b5998',
    },
    saveButton: {
        backgroundColor: '#3b5998',
        marginVertical: 20,
        paddingVertical: 8,
    },
});

export default CreateJournal;
