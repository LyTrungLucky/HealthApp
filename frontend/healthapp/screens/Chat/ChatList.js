import { View, Text, FlatList, Image, TouchableOpacity, RefreshControl } from "react-native";
import { Card, ActivityIndicator, Badge } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const ChatList = () => {
    const [chatRooms, setChatRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const nav = useNavigation();

    useEffect(() => {
        loadChatRooms();
        
        const interval = setInterval(loadChatRooms, 10000);
        return () => clearInterval(interval);
    }, []);

    const loadChatRooms = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await authApis(token).get(endpoints['chat_rooms']);
            setChatRooms(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;

        if (diff < 86400000) { 
            return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        } else if (diff < 604800000) { 
            return date.toLocaleDateString('vi-VN', { weekday: 'short' });
        }
        return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => nav.navigate('ChatScreen', { room: item })}>
            <Card style={{ marginBottom: 10 }}>
                <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ position: 'relative' }}>
                        <Image
                            source={item.other_user?.avatar 
                                ? { uri: item.other_user.avatar } 
                                : require('../../assets/icon.png')}
                            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12 }}
                        />
                        {item.unread_count > 0 && (
                            <Badge style={{ position: 'absolute', top: -5, right: 8 }}>
                                {item.unread_count}
                            </Badge>
                        )}
                    </View>
                    <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ fontWeight: 'bold', fontSize: 16 }}>
                                {item.other_user?.name}
                            </Text>
                            <Text style={{ color: '#999', fontSize: 12 }}>
                                {formatTime(item.last_message_time)}
                            </Text>
                        </View>
                        <Text style={{ color: '#666', fontSize: 13 }}>
                            {item.other_user?.role}
                        </Text>
                        <Text 
                            numberOfLines={1} 
                            style={{ 
                                color: item.unread_count > 0 ? '#000' : '#999',
                                fontWeight: item.unread_count > 0 ? 'bold' : 'normal',
                                marginTop: 4 
                            }}
                        >
                            {item.last_message || 'Chưa có tin nhắn'}
                        </Text>
                    </View>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3b5998" />
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <View style={{ backgroundColor: '#3b5998', padding: 20, paddingTop: 50 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>💬 Tin nhắn</Text>
            </View>

            <FlatList
                data={chatRooms}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ padding: 15 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={() => {
                        setRefreshing(true);
                        loadChatRooms();
                    }} />
                }
                ListEmptyComponent={
                    <View style={{ padding: 40, alignItems: 'center' }}>
                        <Text style={{ fontSize: 48 }}>💬</Text>
                        <Text style={{ color: '#999', marginTop: 10 }}>Chưa có cuộc trò chuyện nào</Text>
                        <Text style={{ color: '#999' }}>Hãy bắt đầu chat với chuyên gia!</Text>
                    </View>
                }
            />
        </View>
    );
};

export default ChatList;