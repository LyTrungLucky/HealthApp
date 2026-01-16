import { View, Text, Image, Dimensions } from "react-native";
import { Button } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import styles from '../../styles/screens/Auth/WelcomeStyles';

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

export default Welcome;