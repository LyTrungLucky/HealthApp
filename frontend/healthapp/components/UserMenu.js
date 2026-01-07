import { useContext, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar } from "react-native-paper";
import { MyUserContext } from "../utils/contexts/MyContext";

const UserMenu = () => {
  const [visible, setVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 16 });
  const avatarRef = useRef(null);

  const [user, dispatch] = useContext(MyUserContext);
  const navigation = useNavigation();

  const openMenu = () => {
    avatarRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPos({
        top: y + height + 6, // 👈 ngay dưới avatar
        right: 16,
      });
      setVisible(true);
    });
  };

  const logout = async () => {
    setVisible(false);
    await AsyncStorage.removeItem("token");
    dispatch({ type: "logout" });
    navigation.navigate("Home");
  };

  return (
    <View>
      {/* AVATAR */}
      <TouchableOpacity ref={avatarRef} onPress={openMenu}>
        <Avatar.Image
          size={40}
          style={styles.avatar}
          source={{
            uri:
              user?.avatar ||
              "https://cdn-icons-png.flaticon.com/512/149/149071.png",
          }}
        />
      </TouchableOpacity>

      {/* MODAL */}
      <Modal transparent visible={visible} animationType="fade">
        <Pressable
          style={styles.backdrop}
          onPress={() => setVisible(false)}
        />

        <View style={[styles.menu, { top: menuPos.top, right: menuPos.right }]}>
          <Pressable
            style={styles.item}
            onPress={() => {
              setVisible(false);
              navigation.navigate("Profile");
            }}
          >
            <Text style={styles.text}>Thông tin cá nhân</Text>
          </Pressable>

          <Pressable style={styles.item} onPress={logout}>
            <Text style={[styles.text, { color: "#e53935" }]}>
              Đăng xuất
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: "#e4e6eb",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  menu: {
    position: "absolute",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingVertical: 8,
    width: 200,
    elevation: 8,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
  },
});

export default UserMenu;
