// screens/Expert/ExpertList.js
import { View, Text, StyleSheet, FlatList, Image, RefreshControl } from "react-native";
import { Searchbar, Card, Chip, ActivityIndicator, Button } from "react-native-paper";
import { useState, useEffect, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";
import { MyUserContext } from "../../utils/contexts/MyContext";

const ExpertList = () => {
    const [experts, setExperts] = useState([]);
    const [selectedRole, setSelectedRole] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [user] = useContext(MyUserContext);
    const nav = useNavigation();

    const roles = [
        { value: null, label: 'Tất cả' },
        { value: 'nutritionist', label: 'Dinh dưỡng' },
        { value: 'trainer', label: 'Huấn luyện viên' },
    ];

    const loadExperts = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                let params = {};
                if (selectedRole) params.role = selectedRole;

                const res = await authApis(token).get(endpoints['experts'], { params });
                setExperts(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadExperts();
    }, [selectedRole]);

    const onRefresh = () => {
        setRefreshing(true);
        loadExperts();
    };

    const getRoleLabel = (role) => {
        switch(role) {
            case 'nutritionist': return '🥗 Chuyên gia dinh dưỡng';
            case 'trainer': return '💪 Huấn luyện viên';
            default: return role;
        }
    };

    // Kiểm tra user có phải expert không
    const isExpert = user?.role && ['nutritionist', 'trainer'].includes(user.role);

    const renderExpert = ({ item }) => (
        <Card style={styles.expertCard}>
            <Card.Content>
                <View style={styles.expertHeader}>
                    <Image
                        source={item.avatar ? { uri: item.avatar } : require('../../assets/icon.png')}
                        style={styles.avatar}
                    />
                    <View style={styles.expertInfo}>
                        <Text style={styles.expertName}>
                            {item.first_name} {item.last_name}
                        </Text>
                        <Chip style={styles.roleChip} textStyle={styles.roleText}>
                            {getRoleLabel(item.role)}
                        </Chip>
                        {item.bio && (
                            <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
                        )}
                    </View>
                </View>
                <Button mode="contained" style={styles.contactButton}>
                    Tư vấn
                </Button>
            </Card.Content>
        </Card>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b5998" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Chuyên Gia</Text>
                
                {/* Nút cho Expert xem khách hàng */}
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
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                />
            </View>

            <View style={styles.rolesContainer}>
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    data={roles}
                    keyExtractor={(item) => item.value || 'all'}
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
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Không có chuyên gia nào</Text>
                    </View>
                }
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
    clientsButton: {
        marginTop: 12,
        backgroundColor: '#ffffff',
    },
    clientsButtonText: {
        color: '#3b5998',
        fontWeight: 'bold',
    },
    searchContainer: {
        padding: 15,
        backgroundColor: '#ffffff',
    },
    searchBar: {
        elevation: 0,
        backgroundColor: '#f5f5f5',
    },
    rolesContainer: {
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
    },
    roleChipFilter: {
        marginRight: 8,
    },
    listContainer: {
        padding: 15,
    },
    expertCard: {
        marginBottom: 15,
        elevation: 2,
    },
    expertHeader: {
        flexDirection: 'row',
        marginBottom: 15,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 15,
        backgroundColor: '#e0e0e0',
    },
    expertInfo: {
        flex: 1,
    },
    expertName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    roleChip: {
        alignSelf: 'flex-start',
        marginBottom: 8,
        backgroundColor: '#e3f2fd',
    },
    roleText: {
        fontSize: 12,
    },
    bio: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    contactButton: {
        backgroundColor: '#4caf50',
    },
    emptyContainer: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});

export default ExpertList;