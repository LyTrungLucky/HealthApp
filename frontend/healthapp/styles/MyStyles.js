// styles/MyStyles.js
import { StyleSheet } from "react-native";

export default StyleSheet.create({
    // Container Styles
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    padding: {
        flex: 1,
        padding: 20,
        backgroundColor: '#ffffff',
    },
    margin: {
        marginVertical: 10,
    },
    
    // Text Styles
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#3b5998',
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        color: '#666',
        marginBottom: 15,
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 10,
    },
    text: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 5,
    },
    
    // Avatar & Image Styles
    avatar: {
        width: 120,
        height: 120,
        borderRadius: 60,
        alignSelf: 'center',
        marginVertical: 15,
        borderWidth: 3,
        borderColor: '#3b5998',
    },
    smallAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 10,
        marginVertical: 10,
    },
    
    // Card Styles
    card: {
        backgroundColor: '#ffffff',
        borderRadius: 15,
        padding: 15,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    
    // Button Styles
    button: {
        marginVertical: 10,
        paddingVertical: 8,
        backgroundColor: '#3b5998',
    },
    buttonOutline: {
        marginVertical: 10,
        paddingVertical: 8,
        borderColor: '#3b5998',
        borderWidth: 2,
    },
    
    // List Styles
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 10,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    
    // Form Styles
    input: {
        marginVertical: 8,
        backgroundColor: '#ffffff',
    },
    inputContainer: {
        marginVertical: 15,
    },
    
    // Badge Styles
    badge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#ffffff',
    },
    
    // Status Colors
    statusSuccess: {
        backgroundColor: '#4caf50',
    },
    statusWarning: {
        backgroundColor: '#ff9800',
    },
    statusError: {
        backgroundColor: '#f44336',
    },
    statusInfo: {
        backgroundColor: '#2196f3',
    },
    
    // Layout Helpers
    row: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    spaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    // Shadow
    shadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    
    // Divider
    divider: {
        height: 1,
        backgroundColor: '#e0e0e0',
        marginVertical: 15,
    },
});