import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from "react-native";
import { Button, ActivityIndicator, Chip, List, Portal, Dialog, RadioButton, TextInput } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const FoodDetail = () => {
    const [food, setFood] = useState(null);
    const [loading, setLoading] = useState(true);
    const [plans, setPlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [selectedPlanId, setSelectedPlanId] = useState(null);
    const [selectedWeekday, setSelectedWeekday] = useState(0);
    const [portion, setPortion] = useState('1.0');
    const route = useRoute();
    const nav = useNavigation();
    const { foodId } = route.params;

    useEffect(() => {
        loadFood();
        loadPlans();
    }, []);

    const loadFood = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const res = await authApis(token).get(endpoints['food_detail'](foodId));
                setFood(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const loadPlans = async () => {
        setPlansLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const res = await authApis(token).get(endpoints['nutrition_plans']);
                setPlans(res.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setPlansLoading(false);
        }
    };

    const postAddMeal = async (planId, weekday = 0, portionVal = 1.0) => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để thêm vào kế hoạch');
                return;
            }

            await authApis(token).post(endpoints['add_meal_to_plan'](planId), {
                food_id: food.id,
                weekday: weekday,
                portion: parseFloat(portionVal) || 1.0
            });

            Alert.alert('Thành công', 'Đã thêm món vào kế hoạch dinh dưỡng');
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể thêm món vào kế hoạch');
        }
    };

    const handleAddToPlan = () => {
        if (plansLoading) {
            Alert.alert('Vui lòng chờ', 'Đang tải kế hoạch...');
            return;
        }

        if (!plans || plans.length === 0) {
            Alert.alert(
                'Chưa có kế hoạch',
                'Bạn chưa có kế hoạch dinh dưỡng nào. Muốn tạo mới?',
                [
                    { text: 'Hủy', style: 'cancel' },
                    { text: 'Tạo', onPress: () => nav.navigate('Plans', { screen: 'CreateNutritionPlan' }) }
                ]
            );
            return;
        }

       
        const buttons = plans.slice(0, 3).map(p => ({ text: p.name, onPress: () => openPlanDialog(p.id) }));
        buttons.push({ text: 'Hủy', style: 'cancel' });

        Alert.alert('Chọn kế hoạch', 'Chọn kế hoạch để thêm món', buttons);
    };

    const openPlanDialog = (planId) => {
        setSelectedPlanId(planId);
        setSelectedWeekday(0);
        setPortion('1.0');
        setDialogVisible(true);
    };

    const confirmAdd = async () => {
        setDialogVisible(false);
        await postAddMeal(selectedPlanId, selectedWeekday, portion);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b5998" />
            </View>
        );
    }

    if (!food) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Không tìm thấy món ăn</Text>
                <Button mode="contained" onPress={() => nav.goBack()}>
                    Quay lại
                </Button>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            
            <View style={styles.header}>
                <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chi tiết món ăn</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                
                <Image 
                    source={food.image ? { uri: food.image } : require('../../assets/icon.png')}
                    style={styles.image}
                />

                
                <View style={styles.titleSection}>
                    <Text style={styles.title}>{food.name}</Text>
                    <Chip style={styles.mealTypeChip}>
                        {food.meal_type_display || food.meal_type}
                    </Chip>
                </View>

               
                <View style={styles.nutritionContainer}>
                    <View style={styles.calorieBox}>
                        <Text style={styles.calorieValue}>{food.calories}</Text>
                        <Text style={styles.calorieLabel}>Calories</Text>
                    </View>
                    
                    <View style={styles.macrosContainer}>
                        <View style={styles.macroBox}>
                            <View style={[styles.macroBar, { backgroundColor: '#4caf50', width: '80%' }]} />
                            <Text style={styles.macroValue}>{food.protein}g</Text>
                            <Text style={styles.macroLabel}>Protein</Text>
                        </View>
                        <View style={styles.macroBox}>
                            <View style={[styles.macroBar, { backgroundColor: '#ff9800', width: '60%' }]} />
                            <Text style={styles.macroValue}>{food.carbs}g</Text>
                            <Text style={styles.macroLabel}>Carbs</Text>
                        </View>
                        <View style={styles.macroBox}>
                            <View style={[styles.macroBar, { backgroundColor: '#f44336', width: '40%' }]} />
                            <Text style={styles.macroValue}>{food.fat}g</Text>
                            <Text style={styles.macroLabel}>Fat</Text>
                        </View>
                    </View>
                </View>

                
                {food.description && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Mô tả</Text>
                        <Text style={styles.description}>{food.description}</Text>
                    </View>
                )}

               
                {food.recipe && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Công thức</Text>
                        <Text style={styles.recipe}>{food.recipe}</Text>
                    </View>
                )}

               
                <Button 
                    mode="contained" 
                    icon="calendar-plus"
                    onPress={handleAddToPlan}
                    style={styles.addButton}
                >
                    Thêm vào kế hoạch dinh dưỡng
                </Button>
            </ScrollView>
            <Portal>
                <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
                    <Dialog.Title>Chọn ngày & khẩu phần</Dialog.Title>
                    <Dialog.Content>
                        <RadioButton.Group onValueChange={v => setSelectedWeekday(parseInt(v, 10))} value={String(selectedWeekday)}>
                            <RadioButton.Item label="Thứ 2" value="0" />
                            <RadioButton.Item label="Thứ 3" value="1" />
                            <RadioButton.Item label="Thứ 4" value="2" />
                            <RadioButton.Item label="Thứ 5" value="3" />
                            <RadioButton.Item label="Thứ 6" value="4" />
                            <RadioButton.Item label="Thứ 7" value="5" />
                            <RadioButton.Item label="Chủ nhật" value="6" />
                        </RadioButton.Group>

                        <TextInput
                            label="Khẩu phần"
                            value={portion}
                            onChangeText={setPortion}
                            keyboardType="numeric"
                            style={{ marginTop: 8 }}
                        />
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogVisible(false)}>Hủy</Button>
                        <Button onPress={confirmAdd}>Thêm</Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
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
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 20,
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
        width: 38,
    },
    content: {
        flex: 1,
    },
    image: {
        width: '100%',
        height: 250,
        backgroundColor: '#e0e0e0',
    },
    titleSection: {
        padding: 20,
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    mealTypeChip: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff3e0',
    },
    nutritionContainer: {
        backgroundColor: '#ffffff',
        padding: 20,
        marginTop: 10,
    },
    calorieBox: {
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        marginBottom: 20,
    },
    calorieValue: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#3b5998',
    },
    calorieLabel: {
        fontSize: 16,
        color: '#666',
        marginTop: 5,
    },
    macrosContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    macroBox: {
        alignItems: 'center',
        flex: 1,
    },
    macroBar: {
        height: 6,
        borderRadius: 3,
        marginBottom: 8,
        alignSelf: 'stretch',
    },
    macroValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    macroLabel: {
        fontSize: 12,
        color: '#999',
    },
    section: {
        backgroundColor: '#ffffff',
        padding: 20,
        marginTop: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 24,
    },
    recipe: {
        fontSize: 15,
        color: '#666',
        lineHeight: 24,
    },
    addButton: {
        margin: 20,
        marginBottom: 30,
        backgroundColor: '#4caf50',
    },
});

export default FoodDetail;