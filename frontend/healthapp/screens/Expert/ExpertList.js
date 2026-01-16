import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import { Searchbar, Card, Chip, ActivityIndicator, Button } from "react-native-paper";
import { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";
import { MyUserContext } from "../../utils/contexts/MyContext";
import styles from "../../styles/screens/Expert/ExpertListStyles";

const ExpertList = () => {
    const [experts, setExperts] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [user] = useContext(MyUserContext);
    const nav = useNavigation();

    const roles = [
        { value: null, label: "Tất cả" },
        { value: "nutritionist", label: "Dinh dưỡng" },
        { value: "trainer", label: "Huấn luyện viên" }
    ];

    const loadExperts = async () => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            let params = {};
            if (selectedRole) params.role = selectedRole;
            if (searchQuery) params.search = searchQuery;

            const res = await authApis(token).get(
                endpoints["experts"],
                { params }
            );
            setExperts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadExperts();
    }, [selectedRole]);

    useEffect(() => {
        const t = setTimeout(() => {
            setLoading(true);
            loadExperts();
        }, 500);
        return () => clearTimeout(t);
    }, [searchQuery]);

    const onRefresh = () => {
        setRefreshing(true);
        loadExperts();
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'nutritionist': return '🥗 Chuyên gia dinh dưỡng';
            case 'trainer': return '💪 Huấn luyện viên';
            default: return role;
        }
    };

    const startChat = async (expertId) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await authApis(token).post(endpoints['start_chat'](expertId));
            nav.navigate('ChatScreen', { room: res.data });
        } catch (e) {
            console.error(e);
            alert('Không thể bắt đầu chat');
        }
    };

    const isExpert = user?.role && ['nutritionist', 'trainer'].includes(user.role);

    const renderExpert = ({ item }) => (
        <Card style={styles.expertCard}>
            <Card.Content>
                <View style={styles.expertHeader}>
                    <Image
                        source={
                            item.avatar
                                ? { uri: item.avatar }
                                : require("../../assets/icon.png")
                        }
                        style={styles.avatar}
                    />
                    <View style={styles.expertInfo}>
                        <Text style={styles.expertName}>
                            {item.first_name || item.username} {item.last_name}
                        </Text>
                        <Chip style={styles.roleChip}>
                            {getRoleLabel(item.role)}
                        </Chip>
                    </View>
                </View>

                <View style={styles.buttonRow}>
                    <Button
                        mode="contained"
                        style={[styles.actionButton, { backgroundColor: '#3b5998' }]}
                        onPress={() => startChat(item.id)}
                    >
                        💬 Chat
                    </Button>
                </View>
            </Card.Content>
        </Card>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chuyên Gia</Text>

                {isExpert && (
                    <Button
                        mode="contained"
                        onPress={() => nav.navigate('ClientList')}
                        style={styles.clientsButton}
                        labelStyle={styles.clientsButtonText}
                        icon="account-group"
                    >
                        Khách hàng của tôi
                    </Button>
                )}
            </View>

            <View style={styles.searchContainer}>
                <Searchbar
                    placeholder="Tìm chuyên gia..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
            </View>

            <View style={styles.rolesContainer}>
                <FlatList
                    horizontal
                    data={roles}
                    keyExtractor={(item) => item.value || "all"}
                    renderItem={({ item }) => (
                        <Chip
                            selected={selectedRole === item.value}
                            onPress={() => setSelectedRole(item.value)}
                            style={styles.roleChipFilter}
                        >
                            {item.label}
                        </Chip>
                    )}
                />
            </View>

            <FlatList
                data={experts}
                renderItem={renderExpert}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.listContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            Không có chuyên gia nào
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

export default ExpertList;
