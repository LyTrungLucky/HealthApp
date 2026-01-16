import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { TextInput, Button, RadioButton, ActivityIndicator } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";
import styles from "../../styles/screens/Profile/HealthProfileStyles";

const HealthProfile = () => {
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        height: '',
        weight: '',
        age: '',
        goal: 'maintain',
        target_weight: '',
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const nav = useNavigation();

    const goalOptions = [
        { value: 'lose_weight', label: '🔥 Giảm cân' },
        { value: 'gain_muscle', label: '💪 Tăng cơ' },
        { value: 'maintain', label: '🎯 Duy trì sức khỏe' },
    ];

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const res = await authApis(token).get(endpoints['my_profile']);
                setProfile(res.data);
                setFormData({
                    height: res.data.height.toString(),
                    weight: res.data.weight.toString(),
                    age: res.data.age.toString(),
                    goal: res.data.goal,
                    target_weight: res.data.target_weight?.toString() || '',
                });
                setIsEditing(false);
            }
        } catch (error) {
            console.log("No profile yet, creating new one");
            setIsEditing(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        
        if (!formData.height || !formData.weight || !formData.age) {
            Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        setSaving(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const data = {
                    height: parseFloat(formData.height),
                    weight: parseFloat(formData.weight),
                    age: parseInt(formData.age),
                    goal: formData.goal,
                    target_weight: formData.target_weight ? parseFloat(formData.target_weight) : null,
                };

                if (profile) {
                    
                    const res = await authApis(token).patch(endpoints['health_profile'] + profile.id + '/', data);
                    setProfile(res.data);
                    setFormData({
                        height: res.data.height.toString(),
                        weight: res.data.weight.toString(),
                        age: res.data.age.toString(),
                        goal: res.data.goal,
                        target_weight: res.data.target_weight?.toString() || '',
                    });
                    setIsEditing(false);
                    Alert.alert("Thành công", "Cập nhật hồ sơ thành công!");
                } else {
                    
                    const res = await authApis(token).post(endpoints['health_profile'], data);
                    setProfile(res.data);
                    setFormData({
                        height: res.data.height.toString(),
                        weight: res.data.weight.toString(),
                        age: res.data.age.toString(),
                        goal: res.data.goal,
                        target_weight: res.data.target_weight?.toString() || '',
                    });
                    setIsEditing(false);
                    Alert.alert("Thành công", "Tạo hồ sơ thành công!");
                }
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Không thể lưu hồ sơ. Vui lòng thử lại!");
        } finally {
            setSaving(false);
        }
    };

    const calculateBMI = () => {
        if (formData.height && formData.weight) {
            const h = parseFloat(formData.height) / 100;
            const w = parseFloat(formData.weight);
            return (w / (h * h)).toFixed(2);
        }
        return 0;
    };

    const getBMIStatus = (bmi) => {
        if (bmi < 18.5) return { text: 'Thiếu cân', color: '#ff9800' };
        if (bmi < 25) return { text: 'Bình thường', color: '#4caf50' };
        if (bmi < 30) return { text: 'Thừa cân', color: '#ff9800' };
        return { text: 'Béo phì', color: '#f44336' };
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b5998" />
            </View>
        );
    }

    const bmi = profile?.bmi || calculateBMI();
    const bmiStatus = getBMIStatus(bmi);

    return (
        <View style={styles.container}>
          
            <View style={styles.header}>
                <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hồ sơ sức khỏe</Text>
                <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
                    <Text style={styles.editText}>{isEditing ? 'Hủy' : 'Sửa'}</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
              
                {profile && !isEditing && (
                    <View style={styles.bmiCard}>
                        <Text style={styles.bmiLabel}>Chỉ số BMI của bạn</Text>
                        <Text style={styles.bmiValue}>{bmi}</Text>
                        <View style={[styles.bmiStatus, { backgroundColor: bmiStatus.color }]}>
                            <Text style={styles.bmiStatusText}>{bmiStatus.text}</Text>
                        </View>
                    </View>
                )}

               
                <View style={styles.form}>
                    <TextInput
                        label="Chiều cao (cm)"
                        value={formData.height}
                        onChangeText={(text) => setFormData({...formData, height: text})}
                        keyboardType="numeric"
                        disabled={!isEditing}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Cân nặng (kg)"
                        value={formData.weight}
                        onChangeText={(text) => setFormData({...formData, weight: text})}
                        keyboardType="numeric"
                        disabled={!isEditing}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Tuổi"
                        value={formData.age}
                        onChangeText={(text) => setFormData({...formData, age: text})}
                        keyboardType="numeric"
                        disabled={!isEditing}
                        mode="outlined"
                        style={styles.input}
                    />

                    <TextInput
                        label="Cân nặng mục tiêu (kg) - Tùy chọn"
                        value={formData.target_weight}
                        onChangeText={(text) => setFormData({...formData, target_weight: text})}
                        keyboardType="numeric"
                        disabled={!isEditing}
                        mode="outlined"
                        style={styles.input}
                    />

                   
                    <View style={styles.goalSection}>
                        <Text style={styles.goalLabel}>Mục tiêu:</Text>
                        <RadioButton.Group
                            onValueChange={(value) => setFormData({...formData, goal: value})}
                            value={formData.goal}
                        >
                            {goalOptions.map((option) => (
                                <View key={option.value} style={styles.radioItem}>
                                    <RadioButton 
                                        value={option.value} 
                                        disabled={!isEditing}
                                    />
                                    <Text style={styles.radioLabel}>{option.label}</Text>
                                </View>
                            ))}
                        </RadioButton.Group>
                    </View>

                    
                    {isEditing && formData.height && formData.weight && (
                        <View style={styles.bmiPreview}>
                            <Text style={styles.previewLabel}>BMI dự kiến: </Text>
                            <Text style={styles.previewValue}>{calculateBMI()}</Text>
                            <Text style={[styles.previewStatus, { color: bmiStatus.color }]}>
                                ({bmiStatus.text})
                            </Text>
                        </View>
                    )}

                
                    {isEditing && (
                        <Button
                            mode="contained"
                            onPress={handleSave}
                            loading={saving}
                            disabled={saving}
                            style={styles.saveButton}
                        >
                            {profile ? 'Cập nhật' : 'Tạo hồ sơ'}
                        </Button>
                    )}
                </View>
            </ScrollView>
        </View>
    );
};

export default HealthProfile;