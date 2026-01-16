import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import { TextInput, Button, HelperText } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import Apis, { endpoints } from "../../utils/Apis";
import styles from "../../styles/screens/Auth/RegisterStyles";

const Register = () => {
    const navigation = useNavigation();

    const [user, setUser] = useState({
        username: "",
        password: "",
        confirm: "",
        first_name: "",
        last_name: "",
        avatar: null,
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== "granted") {
            alert("Cần cấp quyền truy cập ảnh!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setUser({ ...user, avatar: result.assets[0] });
        }
    };

    const validate = () => {
        if (!user.username || !user.password) {
            setError("Vui lòng nhập đầy đủ thông tin!");
            return false;
        }

        if (user.password !== user.confirm) {
            setError("Mật khẩu xác nhận không khớp!");
            return false;
        }

        setError("");
        return true;
    };

    const register = async () => {
        if (!validate()) return;

        try {
            setLoading(true);

            const form = new FormData();
            form.append("username", user.username);
            form.append("password", user.password);
            form.append("confirm", user.confirm);

            if (user.first_name)
                form.append("first_name", user.first_name);

            if (user.last_name)
                form.append("last_name", user.last_name);

            if (user.avatar) {
                form.append("avatar", {
                    uri: user.avatar.uri,
                    name: "avatar.jpg",
                    type: "image/jpeg",
                });
            }

            const res = await Apis.post(endpoints.register, form, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.status === 201) {
                alert("Đăng ký thành công!");
                navigation.navigate("Login");
            }
        } catch (err) {
            console.log("REGISTER ERROR:", err.response?.data || err.message);
            setError("Đăng ký thất bại!");
        } finally {
            setLoading(false);
        }
    };


    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.padding}>
                <Text style={styles.title}>ĐĂNG KÝ TÀI KHOẢN</Text>

                <HelperText type="error" visible={!!error}>
                    {error}
                </HelperText>

                <TextInput
                    label="Tên đăng nhập"
                    value={user.username}
                    onChangeText={(t) => setUser({ ...user, username: t })}
                    style={styles.margin}
                    left={<TextInput.Icon icon="account" />}
                />

                <TextInput
                    label="Mật khẩu"
                    secureTextEntry
                    value={user.password}
                    onChangeText={(t) => setUser({ ...user, password: t })}
                    style={styles.margin}
                    left={<TextInput.Icon icon="lock" />}
                />

                <TextInput
                    label="Xác nhận mật khẩu"
                    secureTextEntry
                    value={user.confirm}
                    onChangeText={(t) => setUser({ ...user, confirm: t })}
                    style={styles.margin}
                    left={<TextInput.Icon icon="lock-check" />}
                />

                <TextInput
                    label="Tên"
                    value={user.first_name}
                    onChangeText={(t) => setUser({ ...user, first_name: t })}
                    style={styles.margin}
                />

                <TextInput
                    label="Họ"
                    value={user.last_name}
                    onChangeText={(t) => setUser({ ...user, last_name: t })}
                    style={styles.margin}
                />


                <TouchableOpacity
                    style={styles.imagePicker}
                    onPress={pickImage}
                >
                    <Text>📷 Chọn ảnh đại diện</Text>
                </TouchableOpacity>

                {user.avatar && (
                    <Image
                        source={{ uri: user.avatar.uri }}
                        style={styles.avatar}
                    />
                )}

                <Button
                    mode="contained"
                    loading={loading}
                    disabled={loading}
                    onPress={register}
                    style={styles.margin}
                >
                    Đăng ký
                </Button>

                <TouchableOpacity
                    onPress={() => navigation.navigate("Login")}
                    style={styles.center}
                >
                    <Text>Đã có tài khoản? Đăng nhập</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default Register;
