import { View, Text, ScrollView, Dimensions } from "react-native";
import { Card, ActivityIndicator, Button, Chip } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const screenWidth = Dimensions.get("window").width;

const Progress = () => {
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState(30);
    const [selectedChart, setSelectedChart] = useState('weight');
    const nav = useNavigation();

    const [weeklyData, setWeeklyData] = useState({
        water_avg: 0,
        workout_count: 0,
        calories_total: 0
    });

    const loadChartData = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await authApis(token).get(`${endpoints['daily_tracking']}?days=${period}`);
            setRawData(res.data || []);
        } catch (e) {
            console.error(e);
            setRawData([]);
        } finally {
            setLoading(false);
        }
    };

    const loadWeeklySummary = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await authApis(token).get(endpoints['weekly_summary']);
            setWeeklyData(res.data);
        } catch (e) {
            console.error('Weekly summary error:', e);
        }
    };

    
    const getChartData = (dataKey) => {
        if (!rawData.length) return { labels: [''], datasets: [{ data: [0] }] };

        const sorted = [...rawData].reverse(); 

        if (period === 7) {
            
            const recent = sorted.slice(-7);
            return {
                labels: recent.map(d => new Date(d.date).getDate().toString()),
                datasets: [{
                    data: recent.map(d => {
                        if (dataKey === 'weight') return d.weight || 0;
                        if (dataKey === 'workout') return Math.round((d.steps || 0) / 100);
                        return Math.round((d.steps || 0) * 0.04);
                    })
                }]
            };

        } else if (period === 30) {
            
            const weeks = [];
            const dataToUse = sorted.slice(-28);

            for (let i = 0; i < 4; i++) {
                const weekData = dataToUse.slice(i * 7, (i + 1) * 7);
                if (weekData.length > 0) {
                    let avg;
                    if (dataKey === 'weight') {
                        avg = weekData.reduce((sum, d) => sum + (d.weight || 0), 0) / weekData.length;
                    } else if (dataKey === 'workout') {
                        avg = weekData.reduce((sum, d) => sum + Math.round((d.steps || 0) / 100), 0) / weekData.length;
                    } else {
                        avg = weekData.reduce((sum, d) => sum + Math.round((d.steps || 0) * 0.04), 0) / weekData.length;
                    }
                    weeks.push({
                        label: `Tuần ${i + 1}`,
                        value: Math.round(avg * 10) / 10
                    });
                }
            }

            return {
                labels: weeks.map(w => w.label),
                datasets: [{ data: weeks.length > 0 ? weeks.map(w => w.value) : [0] }]
            };

        } else {
            
            const months = {};

            sorted.forEach(d => {
                const date = new Date(d.date);
                const key = `${date.getFullYear()}-${date.getMonth()}`;
                if (!months[key]) {
                    months[key] = {
                        values: [],
                        month: date.getMonth() + 1,
                        year: date.getFullYear()
                    };
                }

                let value;
                if (dataKey === 'weight') value = d.weight;
                else if (dataKey === 'workout') value = Math.round((d.steps || 0) / 100);
                else value = Math.round((d.steps || 0) * 0.04);

                if (value) months[key].values.push(value);
            });

            const monthlyData = Object.values(months)
                .filter(m => m.values.length > 0)
                .map(m => ({
                    label: `T${m.month}`,
                    value: Math.round(m.values.reduce((a, b) => a + b, 0) / m.values.length * 10) / 10,
                    sortKey: m.year * 12 + m.month
                }))
                .sort((a, b) => a.sortKey - b.sortKey)
                .slice(-12);

            return {
                labels: monthlyData.map(m => m.label),
                datasets: [{ data: monthlyData.length > 0 ? monthlyData.map(m => m.value) : [0] }]
            };
        }
    };

    const getPeriodLabel = () => {
        if (period === 7) return '7 ngày';
        if (period === 30) return '30 ngày';
        return '1 năm';
    };

    const getChartTitle = () => {
        const suffix = period === 30 ? ' (TB tuần)' : period === 365 ? ' (TB tháng)' : '';
        if (selectedChart === 'weight') return `📊 Biểu đồ cân nặng (kg)${suffix}`;
        if (selectedChart === 'workout') return `🏃 Thời gian tập luyện (phút)${suffix}`;
        return `🔥 Calories tiêu thụ${suffix}`;
    };

    const chartConfig = {
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        decimalPlaces: 1,
        color: (opacity = 1) => {
            if (selectedChart === 'weight') return `rgba(59, 89, 152, ${opacity})`;
            if (selectedChart === 'workout') return `rgba(76, 175, 80, ${opacity})`;
            return `rgba(255, 87, 34, ${opacity})`;
        },
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        style: { borderRadius: 16 },
        propsForDots: {
            r: "4",
            strokeWidth: "2",
            stroke: selectedChart === 'weight' ? "#3b5998" : selectedChart === 'workout' ? "#4caf50" : "#ff5722"
        }
    };

    useEffect(() => {
        const unsub = nav.addListener('focus', () => {
            loadChartData();
            loadWeeklySummary();
        });
        return unsub;
    }, [nav]);

    useEffect(() => {
        loadChartData();
    }, [period]);

    if (loading) return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" />
        </View>
    );

    return (
        <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            <View style={{ backgroundColor: '#3b5998', padding: 20, paddingTop: 50 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>📈 Thống kê tiến độ</Text>
            </View>

            <ScrollView style={{ flex: 1 }}>
                
                <Card style={{ margin: 15 }}>
                    <Card.Content>
                        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Thời gian</Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            {[
                                { days: 7, label: 'Tuần' },
                                { days: 30, label: 'Tháng' },
                                { days: 365, label: 'Năm' }
                            ].map(p => (
                                <Chip
                                    key={p.days}
                                    selected={period === p.days}
                                    onPress={() => setPeriod(p.days)}
                                    style={{ backgroundColor: period === p.days ? '#3b5998' : '#f0f0f0' }}
                                    textStyle={{ color: period === p.days ? '#fff' : '#000' }}
                                >
                                    {p.label}
                                </Chip>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                
                <Card style={{ margin: 15, marginTop: 0 }}>
                    <Card.Content>
                        <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>Loại biểu đồ</Text>
                        <View style={{ flexDirection: 'row', gap: 8 }}>
                            {[
                                { type: 'weight', label: 'Cân nặng', color: '#3b5998' },
                                { type: 'workout', label: 'Tập luyện', color: '#4caf50' },
                                { type: 'calories', label: 'Calories', color: '#ff5722' }
                            ].map(c => (
                                <Chip
                                    key={c.type}
                                    selected={selectedChart === c.type}
                                    onPress={() => setSelectedChart(c.type)}
                                    style={{
                                        flex: 1,
                                        backgroundColor: selectedChart === c.type ? c.color : '#f0f0f0',
                                        justifyContent: 'center',
                                        borderRadius: 12
                                    }}
                                    textStyle={{
                                        color: selectedChart === c.type ? '#fff' : '#000',
                                        textAlign: 'center',
                                        fontWeight: '600'
                                    }}
                                    mode="flat"
                                >
                                    {c.label}
                                </Chip>
                            ))}
                        </View>
                    </Card.Content>
                </Card>

                
                <Card style={{ margin: 15, marginTop: 0 }}>
                    <Card.Content>
                        <Text style={{ fontWeight: 'bold', marginBottom: 15, fontSize: 16 }}>
                            {getChartTitle()}
                        </Text>
                        <LineChart
                            data={getChartData(selectedChart)}
                            width={screenWidth - 60}
                            height={220}
                            chartConfig={chartConfig}
                            bezier
                            style={{ borderRadius: 16 }}
                        />
                    </Card.Content>
                </Card>

                
                <Card style={{ margin: 15, marginTop: 0 }}>
                    <Card.Content>
                        <Text style={{ fontWeight: 'bold', marginBottom: 15, fontSize: 16 }}>
                            📋 Tóm tắt tuần này
                        </Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <Text style={{ fontSize: 24 }}>💧</Text>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#2196f3' }}>
                                    {weeklyData.water_avg}L
                                </Text>
                                <Text style={{ fontSize: 12, color: '#666' }}>Nước/ngày</Text>
                            </View>
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <Text style={{ fontSize: 24 }}>🏃</Text>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4caf50' }}>
                                    {weeklyData.workout_count}
                                </Text>
                                <Text style={{ fontSize: 12, color: '#666' }}>Buổi tập</Text>
                            </View>
                            <View style={{ alignItems: 'center', flex: 1 }}>
                                <Text style={{ fontSize: 24 }}>🔥</Text>
                                <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ff5722' }}>
                                    {weeklyData.calories_total?.toLocaleString() || 0}
                                </Text>
                                <Text style={{ fontSize: 12, color: '#666' }}>Calories</Text>
                            </View>
                        </View>
                    </Card.Content>
                </Card>

                
                <View style={{ padding: 15, gap: 10 }}>
                    <Button
                        mode="contained"
                        onPress={() => nav.navigate('DailyTracking')}
                        style={{ backgroundColor: '#3b5998' }}
                    >
                        📝 Cập nhật dữ liệu hôm nay
                    </Button>
                    <Button
                        mode="outlined"
                        onPress={() => nav.navigate('ReminderList')}
                        style={{ borderColor: '#3b5998' }}
                        textColor="#3b5998"
                    >
                        ⏰ Quản lý nhắc nhở
                    </Button>
                </View>
            </ScrollView>
        </View>
    );
};

export default Progress;