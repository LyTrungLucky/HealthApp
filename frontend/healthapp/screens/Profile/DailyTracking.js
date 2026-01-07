// screens/Profile/DailyTracking.js
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button, ActivityIndicator } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const DailyTracking = () => {
    const [tracking, setTracking] = useState(null);
    const [formData, setFormData] = useState({
        weight: '',
        water_intake: '',
        steps: '',
        heart_rate: '',
        notes: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const nav = useNavigation();

    useEffect(() => {
        loadTodayTracking();
    }, []);

    const loadTodayTracking = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const res = await authApis(token).get(endpoints['today_tracking']);
                setTracking(res.data);
                setFormData({
                    weight: res.data.weight?.toString() || '',
                    water_intake: res.data.water_intake?.toString() || '',
                    steps: res.data.steps?.toString() || '',
                    heart_rate: res.data.heart_rate?.toString() || '',
                    notes: res.data.notes || '',
                });
            }
        } catch (error) {
            console.log("No tracking today");
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const data = {
                    date: new Date().toISOString().split('T')[0],
                    weight: formData.weight ? parseFloat(formData.weight) : null,
                    water_intake: formData.water_intake ? parseInt(formData.water_intake) : 0,
                    steps: formData.steps ? parseInt(formData.steps) : 0,
                    heart_rate: formData.heart_rate ? parseInt(formData.heart_rate) : null,
                    notes: formData.notes,
                };

                if (tracking) {
                    await authApis(token).patch(endpoints['daily_tracking'] + tracking.id + '/', data);
                } else {
                    await authApis(token).post(endpoints['daily_tracking'], data);
                }

                Alert.alert("Thành công", "Cập nhật hoạt động thành công!");
                loadTodayTracking();
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Không thể lưu dữ liệu!");
        } finally {
            setSaving(false);
        }
    };

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
                <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Theo dõi hôm nay</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <View style={styles.form}>
                    <TextInput
                        label="Cân nặng (kg)"
                        value={formData.weight}
                        onChangeText={(text) => setFormData({...formData, weight: text})}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.input}
                        left={<TextInput.Icon icon="weight-kilogram" />}
                    />

                    <TextInput
                        label="Nước uống (ml)"
                        value={formData.water_intake}
                        onChangeText={(text) => setFormData({...formData, water_intake: text})}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.input}
                        left={<TextInput.Icon icon="water" />}
                    />

                    <TextInput
                        label="Số bước đi"
                        value={formData.steps}
                        onChangeText={(text) => setFormData({...formData, steps: text})}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.input}
                        left={<TextInput.Icon icon="walk" />}
                    />

                    <TextInput
                        label="Nhịp tim (bpm)"
                        value={formData.heart_rate}
                        onChangeText={(text) => setFormData({...formData, heart_rate: text})}
                        keyboardType="numeric"
                        mode="outlined"
                        style={styles.input}
                        left={<TextInput.Icon icon="heart-pulse" />}
                    />

                    <TextInput
                        label="Ghi chú"
                        value={formData.notes}
                        onChangeText={(text) => setFormData({...formData, notes: text})}
                        multiline
                        numberOfLines={4}
                        mode="outlined"
                        style={styles.input}
                        left={<TextInput.Icon icon="note-text" />}
                    />

                    <Button
                        mode="contained"
                        onPress={handleSave}
                        loading={saving}
                        disabled={saving}
                        style={styles.saveButton}
                    >
                        Lưu hoạt động
                    </Button>
                </View>
            </ScrollView>
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#3b5998',
        padding: 15,
        paddingTop: 50,
    },
    backButton: {
        padding: 5,
    },
    backIcon: {
        fontSize: 28,
        color: '#ffffff',
        fontWeight: 'bold',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    placeholder: {
        width: 24,
    },
    content: {
        flex: 1,
    },
    form: {
        backgroundColor: '#ffffff',
        margin: 15,
        padding: 20,
        borderRadius: 15,
        elevation: 2,
    },
    input: {
        marginBottom: 15,
    },
    saveButton: {
        marginTop: 10,
        paddingVertical: 8,
    },
});

export default DailyTracking;