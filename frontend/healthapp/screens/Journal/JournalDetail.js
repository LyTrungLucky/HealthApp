import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Image } from "react-native";
import { Card, Button, ActivityIndicator, Chip } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";
import moment from "moment";

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
    headerActions: {
        flexDirection: 'row',
        gap: 10,
    },
    actionButton: {
        padding: 8,
    },
    actionText: {
        fontSize: 18,
    },
    content: {
        flex: 1,
        padding: 15,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    errorText: {
        fontSize: 18,
        color: '#666',
        marginBottom: 20,
    },
    card: {
        marginBottom: 15,
    },
    date: {
        fontSize: 14,
        color: '#3b5998',
        fontWeight: '600',
        marginBottom: 8,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    moodContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    moodEmoji: {
        fontSize: 32,
    },
    moodLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    workoutChip: {
        backgroundColor: '#f0f0f0',
    },
    workoutCompleted: {
        backgroundColor: '#e8f5e8',
    },
    workoutNotCompleted: {
        backgroundColor: '#ffeaea',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    content: {
        fontSize: 16,
        color: '#666',
        lineHeight: 24,
    },
    workoutNotes: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        fontStyle: 'italic',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    statItem: {
        alignItems: 'center',
    },
    statIcon: {
        fontSize: 32,
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 2,
    },
    statValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    energyBar: {
        marginTop: 10,
    },
    energyLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    energyTrack: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    energyFill: {
        height: '100%',
        backgroundColor: '#4caf50',
        borderRadius: 4,
    },
    journalImage: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        resizeMode: 'cover',
    },
    metaInfo: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    actionButtons: {
        flexDirection: 'row',
        padding: 15,
        gap: 10,
    },
    actionBtn: {
        flex: 1,
        paddingVertical: 8,
    },
});

export default JournalDetail;
