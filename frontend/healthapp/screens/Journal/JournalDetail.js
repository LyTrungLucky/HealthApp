import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { Card, Button, ActivityIndicator, Chip } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";
import moment from "moment";
import styles from "../../styles/screens/Journal/JournalDetailStyles";

const JournalDetail = () => {
    const nav = useNavigation();
    const route = useRoute();
    const { journalId } = route.params;

    const [journal, setJournal] = useState(null);
    const [loading, setLoading] = useState(true);

    const moodEmojis = {
        'great': '😄',
        'good': '😊',
        'normal': '😐',
        'tired': '😓',
        'bad': '😢'
    };

    const moodLabels = {
        'great': 'Tuyệt vời',
        'good': 'Tốt',
        'normal': 'Bình thường',
        'tired': 'Mệt mỏi',
        'bad': 'Không tốt'
    };

    const loadJournal = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await authApis(token).get(`${endpoints['health_journals']}${journalId}/`);
            setJournal(res.data);
        } catch (error) {
            console.error('Load journal error:', error);
            Alert.alert('Lỗi', 'Không thể tải thông tin nhật ký');
            nav.goBack();
        } finally {
            setLoading(false);
        }
    };

    const deleteJournal = () => {
        Alert.alert(
            'Xóa nhật ký',
            'Bạn có chắc chắn muốn xóa nhật ký này?',
            [
                { text: 'Hủy', style: 'cancel' },
                {
                    text: 'Xóa',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const token = await AsyncStorage.getItem('token');
                            await authApis(token).delete(`${endpoints['health_journals']}${journalId}/`);
                            Alert.alert('Thành công', 'Đã xóa nhật ký');
                            nav.goBack();
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể xóa nhật ký');
                        }
                    }
                }
            ]
        );
    };

    const editJournal = () => {
        nav.navigate('CreateJournal', { journalId });
    };

    useEffect(() => {
        loadJournal();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b5998" />
                <Text style={styles.loadingText}>Đang tải nhật ký...</Text>
            </View>
        );
    }

    if (!journal) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Không tìm thấy nhật ký</Text>
                <Button onPress={() => nav.goBack()}>Quay lại</Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backText}>← Quay lại</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>📖 Chi tiết nhật ký</Text>
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={editJournal} style={styles.actionButton}>
                        <Text style={styles.actionText}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteJournal} style={styles.actionButton}>
                        <Text style={styles.actionText}>🗑️</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content}>
                
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.date}>
                            📅 {moment(journal.date).format('dddd, DD/MM/YYYY')}
                        </Text>
                        <Text style={styles.title}>{journal.title}</Text>
                    </Card.Content>
                </Card>

                
                <Card style={styles.card}>
                    <Card.Content>
                        <View style={styles.statusRow}>
                            <View style={styles.moodContainer}>
                                <Text style={styles.moodEmoji}>
                                    {moodEmojis[journal.mood] || '😐'}
                                </Text>
                                <Text style={styles.moodLabel}>
                                    {moodLabels[journal.mood] || 'Bình thường'}
                                </Text>
                            </View>

                            <Chip
                                icon={journal.workout_completed ? "check-circle" : "close-circle"}
                                style={[
                                    styles.workoutChip,
                                    journal.workout_completed ? styles.workoutCompleted : styles.workoutNotCompleted
                                ]}
                                textStyle={{
                                    color: journal.workout_completed ? '#4caf50' : '#f44336'
                                }}
                            >
                                {journal.workout_completed ? 'Đã tập luyện' : 'Chưa tập luyện'}
                            </Chip>
                        </View>
                    </Card.Content>
                </Card>

                
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>📝 Nội dung</Text>
                        <Text style={styles.content}>{journal.content}</Text>
                    </Card.Content>
                </Card>

                
                {journal.workout_completed && journal.workout_notes && (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.sectionTitle}>🏃‍♂️ Ghi chú tập luyện</Text>
                            <Text style={styles.workoutNotes}>{journal.workout_notes}</Text>
                        </Card.Content>
                    </Card>
                )}

                
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.sectionTitle}>📊 Thống kê</Text>
                        <View style={styles.statsContainer}>
                            <View style={styles.statItem}>
                                <Text style={styles.statIcon}>⚡</Text>
                                <Text style={styles.statLabel}>Năng lượng</Text>
                                <Text style={styles.statValue}>{journal.energy_level}/10</Text>
                            </View>
                            <View style={styles.statItem}>
                                <Text style={styles.statIcon}>😴</Text>
                                <Text style={styles.statLabel}>Giấc ngủ</Text>
                                <Text style={styles.statValue}>{journal.sleep_hours}h</Text>
                            </View>
                        </View>

                        
                        <View style={styles.energyBar}>
                            <Text style={styles.energyLabel}>Mức năng lượng:</Text>
                            <View style={styles.energyTrack}>
                                <View
                                    style={[
                                        styles.energyFill,
                                        { width: `${(journal.energy_level / 10) * 100}%` }
                                    ]}
                                />
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                
                {journal.image && (
                    <Card style={styles.card}>
                        <Card.Content>
                            <Text style={styles.sectionTitle}>📷 Hình ảnh</Text>
                            <Image source={{ uri: journal.image }} style={styles.journalImage} />
                        </Card.Content>
                    </Card>
                )}

                
                <Card style={styles.card}>
                    <Card.Content>
                        <Text style={styles.metaInfo}>
                            📝 Tạo: {moment(journal.created_at).format('DD/MM/YYYY HH:mm')}
                        </Text>
                        {journal.updated_at !== journal.created_at && (
                            <Text style={styles.metaInfo}>
                                ✏️ Cập nhật: {moment(journal.updated_at).format('DD/MM/YYYY HH:mm')}
                            </Text>
                        )}
                    </Card.Content>
                </Card>
            </ScrollView>

            
            <View style={styles.actionButtons}>
                <Button
                    mode="contained"
                    onPress={editJournal}
                    style={[styles.actionBtn, { backgroundColor: '#3b5998' }]}
                    icon="pencil"
                >
                    Chỉnh sửa
                </Button>
                <Button
                    mode="outlined"
                    onPress={deleteJournal}
                    style={[styles.actionBtn, { borderColor: '#f44336' }]}
                    textColor="#f44336"
                    icon="delete"
                >
                    Xóa
                </Button>
            </View>
        </View>
    );
};

export default JournalDetail;
