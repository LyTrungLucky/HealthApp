import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    RefreshControl,
    Alert
} from "react-native";
import {
    Searchbar,
    Card,
    Chip,
    ActivityIndicator,
    Button
} from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const ExpertList = () => {
    const nav = useNavigation();

    const [experts, setExperts] = useState([]);
    const [consultationMap, setConsultationMap] = useState({});
    const [selectedRole, setSelectedRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const roles = [
        { value: null, label: "Tất cả" },
        { value: "nutritionist", label: "Dinh dưỡng" },
        { value: "trainer", label: "Huấn luyện viên" }
    ];

    const loadConsultationByExpert = async (expertId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return null;

            const res = await authApis(token).get(
                `${endpoints["consultations"]}by-expert/${expertId}/`
            );
            return res.data;
        } catch {
            return null;
        }
    };

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

            const map = {};
            for (let expert of res.data) {
                const c = await loadConsultationByExpert(expert.id);
                if (c) map[expert.id] = c;
            }
            setConsultationMap(map);

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

    const connectExpert = async (expertId) => {
        try {
            const token = await AsyncStorage.getItem("token");
            if (!token) {
                Alert.alert("Thông báo", "Vui lòng đăng nhập");
                return;
            }

            const appointmentDate = new Date(
                Date.now() + 24 * 60 * 60 * 1000
            ).toISOString();

            const res = await authApis(token).post(
                endpoints["consultations"],
                {
                    expert: expertId,
                    appointment_date: appointmentDate
                }
            );

            setConsultationMap(prev => ({
                ...prev,
                [expertId]: res.data
            }));

            Alert.alert("Thành công", "Yêu cầu tư vấn đã được gửi");

        } catch (err) {
            Alert.alert("Lỗi", "Không thể gửi yêu cầu tư vấn");
        }
    };

    const renderConsultButton = (expertId) => {
        const consultation = consultationMap[expertId];

        if (!consultation) {
            return (
                <Button
                    mode="contained"
                    onPress={() => connectExpert(expertId)}
                >
                    Yêu cầu tư vấn
                </Button>
            );
        }

        switch (consultation.status) {
            case "pending":
                return (
                    <Button mode="outlined" disabled>
                        Chờ xác nhận
                    </Button>
                );

            case "confirmed":
                return (
                    <Button
                        mode="contained"
                        onPress={() =>
                            nav.navigate("ConsultationRoom", {
                                consultationId: consultation.id
                            })
                        }
                    >
                        Bắt đầu tư vấn
                    </Button>
                );

            case "cancelled":
                return (
                    <Button
                        mode="contained"
                        onPress={() => connectExpert(expertId)}
                    >
                        Gửi lại yêu cầu
                    </Button>
                );

            default:
                return null;
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case "nutritionist":
                return "🥗 Chuyên gia dinh dưỡng";
            case "trainer":
                return "💪 Huấn luyện viên";
            default:
                return role;
        }
    };

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

                {renderConsultButton(item.id)}
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

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#f5f5f5" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    header: { backgroundColor: "#3b5998", padding: 20, paddingTop: 50 },
    headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
    searchContainer: { padding: 15, backgroundColor: "#fff" },
    rolesContainer: { paddingHorizontal: 15, paddingVertical: 10 },
    listContainer: { padding: 15 },
    expertCard: { marginBottom: 15 },
    expertHeader: { flexDirection: "row", marginBottom: 15 },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15
    },
    expertInfo: { flex: 1 },
    expertName: { fontSize: 18, fontWeight: "bold" },
    roleChip: { alignSelf: "flex-start", marginTop: 5 },
    roleChipFilter: { marginRight: 8 },
    emptyContainer: { padding: 40, alignItems: "center" },
    emptyText: { color: "#999" }
});

export default ExpertList;
