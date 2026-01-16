import { StyleSheet } from 'react-native';
import colors from '../themes/colors';

// Utility styles for common UI elements
export const utilities = StyleSheet.create({
  // Shadow styles
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  shadowLight: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },

  shadowHeavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },

  // Border radius
  rounded: {
    borderRadius: 8,
  },

  roundedSmall: {
    borderRadius: 4,
  },

  roundedLarge: {
    borderRadius: 12,
  },

  roundedFull: {
    borderRadius: 999,
  },

  // Cards
  card: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    elevation: 2,
  },

  cardSmall: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    elevation: 1,
  },

  // Buttons
  buttonPrimary: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  buttonSecondary: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  buttonOutline: {
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
  },

  // Text styles
  textBold: {
    fontWeight: 'bold',
  },

  textCenter: {
    textAlign: 'center',
  },

  textRight: {
    textAlign: 'right',
  },

  // Input styles
  input: {
    marginBottom: 15,
  },

  // Badge
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },

  // Avatar
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.border,
  },

  avatarLarge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.border,
  },

  // Chip
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
});

export default utilities;
