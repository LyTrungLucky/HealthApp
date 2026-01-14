import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { Card, ActivityIndicator, Chip, Button } from "react-native-paper";
import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authApis, endpoints } from "../../utils/Apis";

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
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    // Expert bắt đầu chat với client
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

    if (loading) return <View style={{flex:1,justifyContent:'center',alignItems:'center'}}><ActivityIndicator size="large"/></View>;

    return (
        <View style={{flex:1,backgroundColor:'#f5f5f5'}}>
            <View style={{backgroundColor:'#3b5998',padding:20,paddingTop:50}}>
                <Text style={{fontSize:24,fontWeight:'bold',color:'#fff'}}>👥 Khách hàng của tôi</Text>
            </View>
            <FlatList
                data={clients}
                keyExtractor={i => i.id.toString()}
                contentContainerStyle={{padding:15}}
                renderItem={({item}) => (
                    <Card style={{marginBottom:10}}>
                        <Card.Content>
                            <TouchableOpacity 
                                onPress={() => nav.navigate('ClientProgress', { client: item })}
                                style={{flexDirection:'row',alignItems:'center', marginBottom: 10}}
                            >
                                <Image 
                                    source={item.avatar ? {uri: item.avatar} : require('../../assets/icon.png')}
                                    style={{width:60,height:60,borderRadius:30,marginRight:15}}
                                />
                                <View style={{flex:1}}>
                                    <Text style={{fontSize:16,fontWeight:'bold'}}>{item.name}</Text>
                                    <Text style={{color:'#666'}}>🎯 {item.goal}</Text>
                                    <Text style={{color:'#666'}}>⚖️ {item.weight}kg → {item.target_weight || '?'}kg</Text>
                                </View>
                                <Chip compact>{item.bmi} BMI</Chip>
                            </TouchableOpacity>
                            
                            {/* Nút xem tiến độ và chat */}
                            <View style={{flexDirection:'row', gap: 10}}>
                                <Button 
                                    mode="outlined" 
                                    style={{flex:1}}
                                    onPress={() => nav.navigate('ClientProgress', { client: item })}
                                    icon="chart-line"
                                >
                                    Tiến độ
                                </Button>
                                <Button 
                                    mode="contained" 
                                    style={{flex:1, backgroundColor: '#3b5998'}}
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
                    <View style={{padding:40,alignItems:'center'}}>
                        <Text style={{fontSize:48}}>👥</Text>
                        <Text>Chưa có khách hàng nào</Text>
                    </View>
                }
            />
        </View>
    );
};

export default ClientList;
