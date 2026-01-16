import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Button, HelperText, TextInput } from "react-native-paper";
import Apis, { authApis, endpoints } from "../../utils/Apis";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "../../utils/contexts/MyContext";
import styles from "../../styles/screens/Auth/LoginStyles";

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
        form.append("client_id", "XrCIHBbOBZrjrxOTgbxjFaous1ntygOObuYI47YR");
        form.append("client_secret", "NFiEODhcVx3h0JSFTd5yJZtDQ4ZfzXd1egLFIplZDKEJfrGVbE4tpKh9OQ6R7kmosmJO9GONn48AjGBoSKNuorF7GI6RGtUDtYgQwUddNiSR2HfaNRLkFFrL8ti2pxLA");

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
        <View style={styles.loginContainer}>
            <ScrollView contentContainerStyle={styles.loginScrollContent}>
                <View style={styles.loginHeader}>
                    <Text style={styles.loginTitle}>ĐĂNG NHẬP</Text>
                    <Text style={styles.loginSubtitle}>Chào mừng bạn trở lại!</Text>
                </View>

                <View style={styles.loginFormContainer}>
                    <HelperText type="error" visible={!!err}>
                        {err}
                    </HelperText>

                    <TextInput
                        label="Tên đăng nhập"
                        value={user.username}
                        onChangeText={(t) => setUser({ ...user, username: t })}
                        style={styles.loginInput}
                        left={<TextInput.Icon icon="account" />}
                        mode="outlined"
                    />

                    <TextInput
                        label="Mật khẩu"
                        value={user.password}
                        onChangeText={(t) => setUser({ ...user, password: t })}
                        secureTextEntry={!showPassword}
                        style={styles.loginInput}
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

                    <View style={styles.loginRegisterContainer}>
                        <Text style={styles.loginRegisterText}>Chưa có tài khoản? </Text>
                        <TouchableOpacity onPress={() => nav.navigate("Register")}>
                            <Text style={styles.loginRegisterLink}>Đăng ký ngay</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default Login;
