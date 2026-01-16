import { StyleSheet } from 'react-native';
import colors from '../themes/colors';

// Common layout styles used across the app
export const layouts = StyleSheet.create({
  // Containers
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  containerWhite: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
  },

  // Padding utilities
  padding: {
    padding: 15,
  },

  paddingHorizontal: {
    paddingHorizontal: 15,
  },

  paddingVertical: {
    paddingVertical: 15,
  },

  paddingSmall: {
    padding: 10,
  },

  paddingLarge: {
    padding: 20,
  },

  // Margin utilities
  margin: {
    margin: 15,
  },

  marginHorizontal: {
    marginHorizontal: 15,
  },

  marginVertical: {
    marginVertical: 15,
  },

  marginBottom: {
    marginBottom: 15,
  },

  marginTop: {
    marginTop: 15,
  },

  // Flex utilities
  row: {
    flexDirection: 'row',
  },

  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerVertical: {
    justifyContent: 'center',
  },

  centerHorizontal: {
    alignItems: 'center',
  },

  spaceBetween: {
    justifyContent: 'space-between',
  },

  // Loading container
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },

  // Error container
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },

  // Content
  content: {
    flex: 1,
  },

  scrollContent: {
    padding: 15,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
});

export default layouts;
