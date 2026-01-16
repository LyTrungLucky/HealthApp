import {
    View,
    Text,
    FlatList,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator } from "react-native-paper";
import { useState, useEffect, useRef } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const ChatScreen = () => {
    const { room } = useRoute().params;
    const nav = useNavigation();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const flatListRef = useRef();

    useEffect(() => {
        loadMessages();
        const interval = setInterval(loadMessages, 3000);
        return () => clearInterval(interval);
    }, []);

    const loadMessages = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await authApis(token).get(
                endpoints['chat_messages'](room.id)
            );
            setMessages(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!inputText.trim() || sending) return;
        setSending(true);
        try {
            const token = await AsyncStorage.getItem('token');
            await authApis(token).post(
                endpoints['send_message'](room.id),
                { content: inputText.trim() }
            );
            setInputText('');
            loadMessages();
        } catch (e) {
            alert('Không thể gửi tin nhắn');
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString) => {
        const d = new Date(dateString);
        return d.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderMessage = ({ item }) => (
        <View
            style={{
                flexDirection: item.is_mine ? 'row-reverse' : 'row',
                marginBottom: 10,
                alignItems: 'flex-end'
            }}
        >
            {!item.is_mine && (
                <Image
                    source={
                        item.sender_avatar
                            ? { uri: item.sender_avatar }
                            : require('../../assets/icon.png')
                    }
                    style={{
                        width: 30,
                        height: 30,
                        borderRadius: 15,
                        marginRight: 8
                    }}
                />
            )}

            <View
                style={{
                    maxWidth: '70%',
                    backgroundColor: item.is_mine ? '#3b5998' : '#e0e0e0',
                    padding: 12,
                    borderRadius: 18,
                    borderBottomRightRadius: item.is_mine ? 4 : 18,
                    borderBottomLeftRadius: item.is_mine ? 18 : 4
                }}
            >
                <Text
                    style={{
                        color: item.is_mine ? '#fff' : '#000',
                        fontSize: 15
                    }}
                >
                    {item.content}
                </Text>
                <Text
                    style={{
                        fontSize: 10,
                        marginTop: 4,
                        color: item.is_mine
                            ? 'rgba(255,255,255,0.7)'
                            : '#999',
                        textAlign: item.is_mine ? 'right' : 'left'
                    }}
                >
                    {formatTime(item.created_date)}
                </Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#3b5998' }}>
            <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={0}
            >
                <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
                    <View
                        style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#3b5998',
                            padding: 15,
                            paddingTop: 15
                        }}
                    >
                        <TouchableOpacity onPress={() => nav.goBack()}>
                            <Text style={{ fontSize: 28, color: '#fff' }}>←</Text>
                        </TouchableOpacity>

                        <Image
                            source={
                                room.other_user?.avatar
                                    ? { uri: room.other_user.avatar }
                                    : require('../../assets/icon.png')
                            }
                            style={{
                                width: 40,
                                height: 40,
                                borderRadius: 20,
                                marginHorizontal: 12
                            }}
                        />

                        <View>
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    color: '#fff'
                                }}
                            >
                                {room.other_user?.name}
                            </Text>
                            <Text style={{ fontSize: 12, color: '#e0e0e0' }}>
                                {room.other_user?.role}
                            </Text>
                        </View>
                    </View>

                    <FlatList
                        ref={flatListRef}
                        data={[...messages].reverse()}
                        inverted
                        renderItem={renderMessage}
                        keyExtractor={item => item.id.toString()}
                        contentContainerStyle={{ padding: 15, flexGrow: 1 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    />

                    <View
                        style={{
                            flexDirection: 'row',
                            padding: 10,
                            backgroundColor: '#fff',
                            borderTopWidth: 1,
                            borderTopColor: '#e0e0e0',
                            alignItems: 'flex-end'
                        }}
                    >
                        <TextInput
                            style={{
                                flex: 1,
                                backgroundColor: '#f0f0f0',
                                borderRadius: 20,
                                paddingHorizontal: 15,
                                paddingVertical: 10,
                                maxHeight: 100,
                                minHeight: 40
                            }}
                            placeholder="Nhập tin nhắn..."
                            value={inputText}
                            onChangeText={setInputText}
                            multiline
                            textAlignVertical="center"
                        />

                        <TouchableOpacity
                            onPress={sendMessage}
                            disabled={!inputText.trim() || sending}
                            style={{
                                marginLeft: 10,
                                backgroundColor: inputText.trim()
                                    ? '#3b5998'
                                    : '#ccc',
                                width: 44,
                                height: 44,
                                borderRadius: 22,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {sending ? (
                                <ActivityIndicator size="small" color="#fff" />
                            ) : (
                                <Text style={{ color: '#fff', fontSize: 20 }}>
                                    ➤
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChatScreen;