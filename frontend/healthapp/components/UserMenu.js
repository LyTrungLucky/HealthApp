import { useContext, useRef, useState } from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  Pressable,
  Text,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar } from "react-native-paper";
import { MyUserContext } from "../utils/contexts/MyContext";
import styles from "../styles/components/UserMenuStyles";

const UserMenu = () => {
  const [visible, setVisible] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 16 });
  const avatarRef = useRef(null);

  const [user, dispatch] = useContext(MyUserContext);
  const navigation = useNavigation();

  const openMenu = () => {
    avatarRef.current?.measureInWindow((x, y, width, height) => {
      setMenuPos({
        top: y + height + 6, 
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

export default UserMenu;
