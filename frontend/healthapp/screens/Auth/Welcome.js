import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const Welcome = () => {
    const nav = useNavigation();

    return (
        <LinearGradient
            colors={['#4c669f', '#3b5998', '#192f6a']}
            style={styles.container}
        >
            <View style={styles.content}>
                
                <View style={styles.imageContainer}>
                    <Image 
                        source={require('../../assets/icon.png')} 
                        style={styles.logo}
                        resizeMode="contain"
                    />
                </View>

                
                <View style={styles.textContainer}>
                    <Text style={styles.title}>HEALTH MANAGER</Text>
                    <Text style={styles.subtitle}>
                        Quản lý sức khỏe - Theo dõi hoạt động
                    </Text>
                    <Text style={styles.description}>
                        Ứng dụng giúp bạn theo dõi sức khỏe, lập kế hoạch tập luyện 
                        và dinh dưỡng một cách khoa học
                    </Text>
                </View>

              
                <View style={styles.featuresContainer}>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>💪</Text>
                        <Text style={styles.featureText}>Tập luyện</Text>
                    </View>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>🥗</Text>
                        <Text style={styles.featureText}>Dinh dưỡng</Text>
                    </View>
                    <View style={styles.feature}>
                        <Text style={styles.featureIcon}>📊</Text>
                        <Text style={styles.featureText}>Theo dõi</Text>
                    </View>
                </View>

              
                <View style={styles.buttonContainer}>
                    <Button 
                        mode="contained" 
                        onPress={() => nav.navigate("Login")}
                        style={styles.loginButton}
                        labelStyle={styles.buttonLabel}
                    >
                        Đăng nhập
                    </Button>
                    
                    <Button 
                        mode="outlined" 
                        onPress={() => nav.navigate("Register")}
                        style={styles.registerButton}
                        labelStyle={styles.registerButtonLabel}
                    >
                        Đăng ký ngay
                    </Button>
                </View>
            </View>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 30,
        paddingVertical: 50,
    },
    imageContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    logo: {
        width: width * 0.5,
        height: height * 0.2,
    },
    textContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#ffffff',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#e0e0e0',
        marginBottom: 15,
        textAlign: 'center',
    },
    description: {
        fontSize: 14,
        color: '#d0d0d0',
        textAlign: 'center',
        lineHeight: 22,
    },
    featuresContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginVertical: 20,
    },
    feature: {
        alignItems: 'center',
    },
    featureIcon: {
        fontSize: 40,
        marginBottom: 5,
    },
    featureText: {
        color: '#ffffff',
        fontSize: 14,
        fontWeight: '500',
    },
    buttonContainer: {
        width: '100%',
        gap: 15,
    },
    loginButton: {
        paddingVertical: 8,
        backgroundColor: '#ffffff',
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#3b5998',
    },
    registerButton: {
        paddingVertical: 8,
        borderColor: '#ffffff',
        borderWidth: 2,
    },
    registerButtonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#ffffff',
    },
});

export default Welcome;