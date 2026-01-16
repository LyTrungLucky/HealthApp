import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Card, ActivityIndicator, Chip, Button } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";
import styles from "../../styles/screens/Expert/ClientListStyles";

const ClientList = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const nav = useNavigation();

    useEffect(() => {
        loadClients();
    }, []);

    const loadClients = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await authApis(token).get(endpoints['my_clients']);
            setClients(res.data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const startChat = async (clientId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await authApis(token).post(endpoints['start_chat'](clientId));
            nav.navigate('ChatScreen', { room: res.data });
        } catch (e) {
            console.error(e);
            alert('Không thể bắt đầu chat');
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large"/>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>👥 Khách hàng của tôi</Text>
            </View>

            <FlatList
                data={clients}
                keyExtractor={i => i.id.toString()}
                contentContainerStyle={styles.listContainer}
                renderItem={({item}) => (
                    <Card style={styles.clientCard}>
                        <Card.Content>
                            <TouchableOpacity
                                onPress={() => nav.navigate('ClientProgress', { client: item })}
                                style={styles.clientHeader}
                            >
                                <Image
                                    source={item.avatar ? {uri: item.avatar} : require('../../assets/icon.png')}
                                    style={styles.avatar}
                                />
                                <View style={styles.clientInfo}>
                                    <Text style={styles.clientName}>{item.name}</Text>
                                    <Text style={styles.clientGoal}>🎯 {item.goal}</Text>
                                    <Text style={styles.clientWeight}>
                                        ⚖️ {item.weight}kg → {item.target_weight || '?'}kg
                                    </Text>
                                </View>
                                <Chip compact>{item.bmi} BMI</Chip>
                            </TouchableOpacity>

                            <View style={styles.buttonRow}>
                                <Button
                                    mode="outlined"
                                    style={styles.progressButton}
                                    onPress={() => nav.navigate('ClientProgress', { client: item })}
                                    icon="chart-line"
                                >
                                    Tiến độ
                                </Button>
                                <Button
                                    mode="contained"
                                    style={styles.chatButton}
                                    onPress={() => startChat(item.id)}
                                    icon="chat"
                                >
                                    💬 Chat
                                </Button>
                            </View>
                        </Card.Content>
                    </Card>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyIcon}>👥</Text>
                        <Text style={styles.emptyText}>Chưa có khách hàng nào</Text>
                    </View>
                }
            />
        </View>
    );
};

export default ClientList;
