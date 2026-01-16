import { View, Text, ScrollView, Dimensions } from "react-native";
import { Card, ActivityIndicator, SegmentedButtons } from "react-native-paper";
import { useState, useEffect } from "react";
import { LineChart, BarChart } from "react-native-chart-kit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";
import styles from "../../styles/screens/Statistics/WeeklyStatsStyles";

const screenWidth = Dimensions.get("window").width;

const WeeklyStats = () => {
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState('week');
    const [trackingData, setTrackingData] = useState([]);
    const [progressData, setProgressData] = useState([]);

    useEffect(() => {
        loadData();
    }, [period]);

    const loadData = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            if (token) {
                const days = period === 'week' ? 7 : 30;
                
              
                const trackingRes = await authApis(token).get(endpoints['weekly_summary']);
                setTrackingData(trackingRes.data);

               
                const progressRes = await authApis(token).get(endpoints['chart_data'], {
                    params: { days }
                });
                setProgressData(progressRes.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const getChartData = () => {
        if (progressData.length === 0) {
            return {
                labels: ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'],
                datasets: [{ data: [0, 0, 0, 0, 0, 0, 0] }]
            };
        }

        const labels = progressData.slice(-7).map(d => {
            const date = new Date(d.date);
            return date.toLocaleDateString('vi-VN', { weekday: 'short' });
        });

        const weights = progressData.slice(-7).map(d => d.weight || 0);

        return {
            labels,
            datasets: [{ data: weights.length > 0 ? weights : [0] }]
        };
    };

    const getCaloriesData = () => {
        const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        
        
        const caloriesPerDay = new Array(7).fill(0);
        trackingData.forEach(item => {
            const dayIndex = new Date(item.date).getDay();
            const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1;
          
            caloriesPerDay[adjustedIndex] = item.steps ? Math.round(item.steps * 0.04) : 0;
        });

        return {
            labels,
            datasets: [{ data: caloriesPerDay }]
        };
    };

    const chartConfig = {
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        color: (opacity = 1) => `rgba(59, 89, 152, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.5,
        useShadowColorFromDataset: false,
        decimalPlaces: 1,
    };

    const getTotalStats = () => {
        const totalSteps = trackingData.reduce((sum, d) => sum + (d.steps || 0), 0);
        const totalWater = trackingData.reduce((sum, d) => sum + (d.water_intake || 0), 0);
        const avgWeight = progressData.length > 0 
            ? (progressData.reduce((sum, d) => sum + (d.weight || 0), 0) / progressData.length).toFixed(1)
            : 0;

        return { totalSteps, totalWater, avgWeight };
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3b5998" />
            </View>
        );
    }

    const stats = getTotalStats();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Thống kê</Text>
            </View>

            <ScrollView style={styles.content}>
               
                <SegmentedButtons
                    value={period}
                    onValueChange={setPeriod}
                    buttons={[
                        { value: 'week', label: 'Tuần này' },
                        { value: 'month', label: 'Tháng này' },
                    ]}
                    style={styles.segmentedButtons}
                />

                <View style={styles.summaryGrid}>
                    <Card style={styles.summaryCard}>
                        <Card.Content style={styles.summaryContent}>
                            <Text style={styles.summaryIcon}>👣</Text>
                            <Text style={styles.summaryValue}>{stats.totalSteps.toLocaleString()}</Text>
                            <Text style={styles.summaryLabel}>Bước đi</Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.summaryCard}>
                        <Card.Content style={styles.summaryContent}>
                            <Text style={styles.summaryIcon}>💧</Text>
                            <Text style={styles.summaryValue}>{stats.totalWater}</Text>
                            <Text style={styles.summaryLabel}>ml nước</Text>
                        </Card.Content>
                    </Card>

                    <Card style={styles.summaryCard}>
                        <Card.Content style={styles.summaryContent}>
                            <Text style={styles.summaryIcon}>⚖️</Text>
                            <Text style={styles.summaryValue}>{stats.avgWeight}</Text>
                            <Text style={styles.summaryLabel}>kg TB</Text>
                        </Card.Content>
                    </Card>
                </View>

               
                <Card style={styles.chartCard}>
                    <Card.Content>
                        <Text style={styles.chartTitle}>📈 Biến động cân nặng</Text>
                        <LineChart
                            data={getChartData()}
                            width={screenWidth - 60}
                            height={200}
                            chartConfig={chartConfig}
                            bezier
                            style={styles.chart}
                        />
                    </Card.Content>
                </Card>

                
                <Card style={styles.chartCard}>
                    <Card.Content>
                        <Text style={styles.chartTitle}>🔥 Calories tiêu thụ</Text>
                        <BarChart
                            data={getCaloriesData()}
                            width={screenWidth - 60}
                            height={200}
                            chartConfig={{
                                ...chartConfig,
                                color: (opacity = 1) => `rgba(255, 152, 0, ${opacity})`,
                            }}
                            style={styles.chart}
                        />
                    </Card.Content>
                </Card>
            </ScrollView>
        </View>
    );
};

export default WeeklyStats;