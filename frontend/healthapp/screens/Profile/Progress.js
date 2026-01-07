// screens/Profile/Progress.js - Simple placeholder
import { View, Text, StyleSheet } from "react-native";

const Progress = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Tiến Độ</Text>
            </View>
            <View style={styles.content}>
                <Text style={styles.comingSoon}>📊 Tính năng đang phát triển</Text>
                <Text style={styles.description}>Biểu đồ tiến độ sẽ được cập nhật sớm</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#3b5998',
        padding: 20,
        paddingTop: 50,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    comingSoon: {
        fontSize: 18,
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: '#666',
    },
});

export default Progress;
