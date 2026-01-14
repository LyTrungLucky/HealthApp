import { View, Text, ScrollView, Dimensions } from "react-native";
import { Card, ActivityIndicator, Chip, Button } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";
import { useState, useEffect } from "react";
import { useRoute, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

const screenWidth = Dimensions.get("window").width;

const ClientProgress = () => {
  const { client } = useRoute().params;
  const nav = useNavigation();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [period, setPeriod] = useState(30);

  useEffect(() => { loadData(); }, [period]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await authApis(token).get(endpoints['client_progress'](client.id), {
        params: { days: period }
      });
      setData(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const getWeightChart = () => {
    if (!data?.tracking?.length) return { labels: [''], datasets: [{ data: [0] }] };

    const sorted = [...data.tracking].reverse(); 

    if (period === 7) {
      
      const recent = sorted.slice(-7);
      return {
        labels: recent.map(d => new Date(d.date).getDate().toString()),
        datasets: [{ data: recent.map(d => d.weight || 0) }]
      };

    } else if (period === 30) {
      const weeks = [];
      const dataToUse = sorted.slice(-28); 

      for (let i = 0; i < 4; i++) {
        const weekData = dataToUse.slice(i * 7, (i + 1) * 7);
        if (weekData.length > 0) {
          const avgWeight = weekData.reduce((sum, d) => sum + (d.weight || 0), 0) / weekData.length;
          weeks.push({
            label: `Tuần ${i + 1}`,
            weight: Math.round(avgWeight * 10) / 10
          });
        }
      }

      return {
        labels: weeks.map(w => w.label),
        datasets: [{ data: weeks.length > 0 ? weeks.map(w => w.weight) : [0] }]
      };

    } else {
      const months = {};

      sorted.forEach(d => {
        const date = new Date(d.date);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        if (!months[key]) {
          months[key] = {
            weights: [],
            month: date.getMonth() + 1,
            year: date.getFullYear()
          };
        }
        if (d.weight) months[key].weights.push(d.weight);
      });

      const monthlyData = Object.values(months)
        .filter(m => m.weights.length > 0)
        .map(m => ({
          label: `T${m.month}`,
          weight: Math.round(m.weights.reduce((a, b) => a + b, 0) / m.weights.length * 10) / 10,
          sortKey: m.year * 12 + m.month
        }))
        .sort((a, b) => a.sortKey - b.sortKey)
        .slice(-12); 

      return {
        labels: monthlyData.map(m => m.label),
        datasets: [{ data: monthlyData.length > 0 ? monthlyData.map(m => m.weight) : [0] }]
      };
    }
  };

  const getAnalysis = () => {
    if (!data?.tracking?.length) return null;
    const weights = data.tracking.map(t => t.weight).filter(Boolean);
    if (weights.length < 2) return null;

    const first = weights[weights.length - 1]; 
    const last = weights[0]; 
    const change = last - first;
    const avgWater = data.tracking.reduce((s, t) => s + (t.water_intake || 0), 0) / data.tracking.length;
    const avgSteps = data.tracking.reduce((s, t) => s + (t.steps || 0), 0) / data.tracking.length;

    return { change, avgWater, avgSteps };
  };

  const getPeriodLabel = () => {
    if (period === 7) return '7 ngày';
    if (period === 30) return '30 ngày';
    return '1 năm';
  };

  if (loading) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" /></View>;

  const analysis = getAnalysis();

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#3b5998', padding: 15, paddingTop: 50 }}>
        <Text onPress={() => nav.goBack()} style={{ fontSize: 28, color: '#fff', marginRight: 15 }}>←</Text>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#fff' }}>{data?.client?.name || client.name}</Text>
          <Text style={{ color: '#e0e0e0' }}>🎯 {data?.client?.goal}</Text>
        </View>
      </View>

      <ScrollView>
        <View style={{ flexDirection: 'row', gap: 8, padding: 15 }}>
          {[{ d: 7, l: 'Tuần' }, { d: 30, l: 'Tháng' }, { d: 365, l: 'Năm' }].map(p => (
            <Chip key={p.d} selected={period === p.d} onPress={() => setPeriod(p.d)}
              style={{ backgroundColor: period === p.d ? '#3b5998' : '#e0e0e0' }}
              textStyle={{ color: period === p.d ? '#fff' : '#000' }}>
              {p.l}
            </Chip>
          ))}
        </View>

        
        <Card style={{ margin: 15, marginTop: 0 }}><Card.Content>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>📋 Thông tin</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#3b5998' }}>{data?.client?.current_weight}kg</Text>
              <Text style={{ color: '#666' }}>Hiện tại</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#4caf50' }}>{data?.client?.target_weight || '-'}kg</Text>
              <Text style={{ color: '#666' }}>Mục tiêu</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#ff9800' }}>{data?.client?.bmi}</Text>
              <Text style={{ color: '#666' }}>BMI</Text>
            </View>
          </View>
        </Card.Content></Card>

        
        <Card style={{ margin: 15, marginTop: 0 }}><Card.Content>
          <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>
            📈 Biến động cân nặng {period === 30 ? '(TB tuần)' : period === 365 ? '(TB tháng)' : ''}
          </Text>
          <LineChart
            data={getWeightChart()}
            width={screenWidth - 60}
            height={180}
            chartConfig={{
              backgroundGradientFrom: '#fff', backgroundGradientTo: '#fff',
              color: (o = 1) => `rgba(59,89,152,${o})`, decimalPlaces: 1
            }}
            bezier
            style={{ borderRadius: 10 }}
          />
        </Card.Content></Card>

       
        {analysis && (
          <Card style={{ margin: 15, marginTop: 0 }}><Card.Content>
            <Text style={{ fontWeight: 'bold', marginBottom: 10 }}>💡 Phân tích & Đề xuất</Text>

            <View style={{ backgroundColor: '#f5f5f5', padding: 10, borderRadius: 8, marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>Thay đổi cân nặng:</Text>
              <Text style={{ color: analysis.change < 0 ? '#4caf50' : analysis.change > 0 ? '#f44336' : '#666' }}>
                {analysis.change > 0 ? '+' : ''}{analysis.change.toFixed(1)}kg trong {getPeriodLabel()}
              </Text>
            </View>

            <View style={{ backgroundColor: '#e3f2fd', padding: 10, borderRadius: 8, marginBottom: 10 }}>
              <Text style={{ fontWeight: 'bold' }}>💧 Nước uống TB: {Math.round(analysis.avgWater)}ml/ngày</Text>
              <Text style={{ color: '#666', marginTop: 5 }}>
                {analysis.avgWater < 1500 ? '⚠️ Cần tăng lượng nước uống (khuyến nghị 2000ml)' : '✅ Đạt yêu cầu'}
              </Text>
            </View>

            <View style={{ backgroundColor: '#e8f5e9', padding: 10, borderRadius: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>🚶 Bước chân TB: {Math.round(analysis.avgSteps)} bước/ngày</Text>
              <Text style={{ color: '#666', marginTop: 5 }}>
                {analysis.avgSteps < 5000 ? '⚠️ Cần tăng vận động (khuyến nghị 8000 bước)' : '✅ Hoạt động tốt'}
              </Text>
            </View>
          </Card.Content></Card>
        )}

        
        <View style={{ padding: 15, gap: 10 }}>
          <Button mode="contained" style={{ backgroundColor: '#4caf50' }}>
            📝 Tạo kế hoạch mới cho {client.name?.split(' ')[0]}
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default ClientProgress;