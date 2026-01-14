import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from "react-native";
import { Card, FAB, Chip, ActivityIndicator, Searchbar, List } from "react-native-paper";
import { useState, useEffect, useCallback } from "react";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";
import moment from "moment";

const JournalList = () => {
    const [journals, setJournals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterMood, setFilterMood] = useState('all');
    const [filterWorkout, setFilterWorkout] = useState('all');
    const [viewMode, setViewMode] = useState('list'); 
    const nav = useNavigation();

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


    const loadJournals = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await authApis(token).get(endpoints['health_journals']);
            setJournals(res.data || []);
        } catch (error) {
            console.error('Load journals error:', error);
            Alert.alert('Lỗi', 'Không thể tải danh sách nhật ký');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        loadJournals();
    };

    const deleteJournal = async (id) => {
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
                            await authApis(token).delete(`${endpoints['health_journals']}${id}/`);
                            loadJournals();
                        } catch (error) {
                            Alert.alert('Lỗi', 'Không thể xóa nhật ký');
                        }
                    }
                }
            ]
        );
    };

    const filteredJournals = journals.filter(journal => {
        const matchSearch = journal.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          journal.content?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchMood = filterMood === 'all' || journal.mood === filterMood;
        const matchWorkout = filterWorkout === 'all' || 
                           (filterWorkout === 'completed' && journal.workout_completed) ||
                           (filterWorkout === 'not_completed' && !journal.workout_completed);
        
        return matchSearch && matchMood && matchWorkout;
    });

    useFocusEffect(
        useCallback(() => {
            loadJournals();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b5998" />
                <Text style={styles.loadingText}>Đang tải nhật ký...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            
            <View style={styles.header}>
                <Text style={styles.headerTitle}>📖 Nhật ký sức khỏe</Text>
            </View>

            <ScrollView 
                style={styles.content}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                
                <Searchbar
                    placeholder="Tìm kiếm nhật ký..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />

                
                <Card style={styles.filterCard}>
                    <Card.Content>
                        <Text style={styles.filterTitle}>Lọc theo tâm trạng:</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            <View style={styles.filterRow}>
                                <Chip
                                    selected={filterMood === 'all'}
                                    onPress={() => setFilterMood('all')}
                                    style={[styles.filterChip, filterMood === 'all' && styles.selectedChip]}
                                >
                                    Tất cả
                                </Chip>
                                {Object.entries(moodEmojis).map(([mood, emoji]) => (
                                    <Chip
                                        key={mood}
                                        selected={filterMood === mood}
                                        onPress={() => setFilterMood(mood)}
                                        style={[styles.filterChip, filterMood === mood && styles.selectedChip]}
                                    >
                                        {emoji} {moodLabels[mood]}
                                    </Chip>
                                ))}
                            </View>
                        </ScrollView>

                        <Text style={[styles.filterTitle, { marginTop: 15 }]}>Lọc theo tập luyện:</Text>
                        <View style={styles.filterRow}>
                            <Chip
                                selected={filterWorkout === 'all'}
                                onPress={() => setFilterWorkout('all')}
                                style={[styles.filterChip, filterWorkout === 'all' && styles.selectedChip]}
                            >
                                Tất cả
                            </Chip>
                            <Chip
                                selected={filterWorkout === 'completed'}
                                onPress={() => setFilterWorkout('completed')}
                                style={[styles.filterChip, filterWorkout === 'completed' && styles.selectedChip]}
                            >
                                ✅ Đã tập
                            </Chip>
                            <Chip
                                selected={filterWorkout === 'not_completed'}
                                onPress={() => setFilterWorkout('not_completed')}
                                style={[styles.filterChip, filterWorkout === 'not_completed' && styles.selectedChip]}
                            >
                                ❌ Chưa tập
                            </Chip>
                        </View>
                    </Card.Content>
                </Card>

                
                {filteredJournals.length === 0 ? (
                    <Card style={styles.emptyCard}>
                        <Card.Content style={styles.emptyContent}>
                            <Text style={styles.emptyIcon}>📝</Text>
                            <Text style={styles.emptyTitle}>Chưa có nhật ký nào</Text>
                            <Text style={styles.emptySubtitle}>
                                {searchQuery || filterMood !== 'all' || filterWorkout !== 'all' 
                                    ? 'Không tìm thấy nhật ký phù hợp với bộ lọc'
                                    : 'Hãy tạo nhật ký đầu tiên của bạn!'
                                }
                            </Text>
                        </Card.Content>
                    </Card>
                ) : (
                    filteredJournals.map((journal) => (
                        <Card key={journal.id} style={styles.journalCard}>
                            <TouchableOpacity
                                onPress={() => nav.navigate('JournalDetail', { journalId: journal.id })}
                            >
                                <Card.Content>
                                    <View style={styles.journalHeader}>
                                        <View style={styles.journalInfo}>
                                            <Text style={styles.journalDate}>
                                                {moment(journal.date).format('DD/MM/YYYY')}
                                            </Text>
                                            <Text style={styles.journalTitle}>
                                                {journal.title || 'Nhật ký không có tiêu đề'}
                                            </Text>
                                        </View>
                                        <View style={styles.journalMeta}>
                                            <Text style={styles.moodEmoji}>
                                                {moodEmojis[journal.mood] || '😐'}
                                            </Text>
                                            {journal.workout_completed && (
                                                <Text style={styles.workoutBadge}>🏃‍♂️</Text>
                                            )}
                                        </View>
                                    </View>
                                    
                                    <Text style={styles.journalContent} numberOfLines={2}>
                                        {journal.content || 'Không có nội dung'}
                                    </Text>
                                    
                                    <View style={styles.journalFooter}>
                                        <View style={styles.journalStats}>
                                            <Text style={styles.statText}>
                                                ⚡ Năng lượng: {journal.energy_level}/10
                                            </Text>
                                            <Text style={styles.statText}>
                                                😴 Giấc ngủ: {journal.sleep_hours}h
                                            </Text>
                                        </View>
                                        <TouchableOpacity
                                            onPress={() => deleteJournal(journal.id)}
                                            style={styles.deleteButton}
                                        >
                                            <Text style={styles.deleteText}>🗑️</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Card.Content>
                            </TouchableOpacity>
                        </Card>
                    ))
                )}
            </ScrollView>

            
            <FAB
                icon="plus"
                style={styles.fab}
                onPress={() => nav.navigate('CreateJournal')}
                label="Tạo nhật ký"
            />
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
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
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
    searchBar: {
        marginBottom: 15,
        elevation: 2,
    },
    filterCard: {
        marginBottom: 15,
    },
    filterTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#666',
        marginBottom: 8,
    },
    filterRow: {
        flexDirection: 'row',
        gap: 8,
    },
    filterChip: {
        backgroundColor: '#f0f0f0',
    },
    selectedChip: {
        backgroundColor: '#3b5998',
    },
    emptyCard: {
        marginTop: 50,
    },
    emptyContent: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    emptyIcon: {
        fontSize: 48,
        marginBottom: 15,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
    journalCard: {
        marginBottom: 15,
        elevation: 2,
    },
    journalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    journalInfo: {
        flex: 1,
    },
    journalDate: {
        fontSize: 12,
        color: '#3b5998',
        fontWeight: '600',
    },
    journalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 2,
    },
    journalMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    moodEmoji: {
        fontSize: 24,
    },
    workoutBadge: {
        fontSize: 20,
    },
    journalContent: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 10,
    },
    journalFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    journalStats: {
        flex: 1,
    },
    statText: {
        fontSize: 12,
        color: '#888',
        marginBottom: 2,
    },
    deleteButton: {
        padding: 8,
    },
    deleteText: {
        fontSize: 18,
    },
    fab: {
        position: 'absolute',
        margin: 16,
        right: 0,
        bottom: 0,
        backgroundColor: '#3b5998',
    },
});

export default JournalList;
