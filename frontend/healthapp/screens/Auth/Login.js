import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, HelperText, TextInput } from "react-native-paper";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "../../utils/contexts/MyContext";

const Login = ({ route }) => {
    const nav = useNavigation();
    const [, dispatch] = useContext(MyUserContext);

    const [user, setUser] = useState({
        username: "",
        password: "",
    });

    const [err, setErr] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

   
    const validate = () => {
        if (!user.username || !user.password) {
            setErr("Vui lòng nhập đầy đủ thông tin!");
            return false;
        }
        setErr("");
        return true;
    };

    
    const login = async () => {
    if (!validate()) return;

    try {
        setLoading(true);

        const form = new URLSearchParams();
        form.append("grant_type", "password");
        form.append("username", user.username);
        form.append("password", user.password);
        form.append("client_id", "vMi6KUJEEMw5Onn0J1aZf9dk8VJKZ9Gv4xwXjLi0");
        form.append("client_secret", "Oq0MHQpkK3cfhnP8Pos0dkT6HVyYVrI7KuR6SpPyiT9RXUWE1Mhndnn1sYvsmMHNBsQiAQI8OFCy8Gry4z0pL1Ve1uUtkJFuskGzCBaewaAlv2dVDcs1PzRViKbtknux");

        const res = await Apis.post(
            endpoints.login,
            form.toString(),
            {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        );

        await AsyncStorage.setItem("token", res.data.access_token);

        const userRes = await authApis(res.data.access_token)
            .get(endpoints.current_user);

        dispatch({
            type: "login",
            payload: userRes.data
        });

    } catch (e) {
        console.log("LOGIN ERROR:", e.response?.data);
        setErr("Sai tài khoản hoặc mật khẩu!");
    } finally {
        setLoading(false);
    }
};


    
    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <Text style={styles.title}>ĐĂNG NHẬP</Text>
                    <Text style={styles.subtitle}>Chào mừng bạn trở lại!</Text>
                </View>

                <View style={styles.formContainer}>
                    <HelperText type="error" visible={!!err}>
                        {err}
                    </HelperText>

                    <TextInput
                        label="Tên đăng nhập"
                        value={user.username}
                        onChangeText={(t) => setUser({ ...user, username: t })}
                        style={styles.input}
                        left={<TextInput.Icon icon="account" />}
                        mode="outlined"
                    />

                    <TextInput
                        label="Mật khẩu"
                        value={user.password}
                        onChangeText={(t) => setUser({ ...user, password: t })}
                        secureTextEntry={!showPassword}
                        style={styles.input}
                        left={<TextInput.Icon icon="lock" />}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                        mode="outlined"
                    />

                    <Button
                        loading={loading}
                        disabled={loading}
                        mode="contained"
                        icon="login"
                        style={styles.loginButton}
                        onPress={login}
                    >
                        Đăng nhập
                    </Button>

                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Chưa có tài khoản? </Text>
                        <TouchableOpacity onPress={() => nav.navigate("Register")}>
                            <Text style={styles.registerLink}>Đăng ký ngay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: '#f5f5f5', }, scrollContent: { flexGrow: 1, paddingHorizontal: 20, paddingVertical: 40, }, header: { alignItems: 'center', marginBottom: 40, marginTop: 20, }, title: { fontSize: 32, fontWeight: 'bold', color: '#3b5998', marginBottom: 8, }, subtitle: { fontSize: 16, color: '#666', }, formContainer: { backgroundColor: '#ffffff', borderRadius: 15, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 5, }, errorText: { marginBottom: 10, }, input: { marginBottom: 15, }, loginButton: { marginTop: 10, paddingVertical: 8, backgroundColor: '#3b5998', }, registerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20, }, registerText: { color: '#666', fontSize: 14, }, registerLink: { color: '#3b5998', fontSize: 14, fontWeight: 'bold', }, });
export default Login;
