import { StyleSheet } from 'react-native';
import colors from '../../themes/colors';

export const styles = StyleSheet.create({
  dailyTrackingContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  dailyTrackingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 15,
    paddingTop: 50,
  },
  dailyTrackingBackButton: {
    padding: 5,
  },
  dailyTrackingBackIcon: {
    fontSize: 28,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  dailyTrackingHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  dailyTrackingPlaceholder: {
    width: 24,
  },
  dailyTrackingContent: {
    flex: 1,
  },
  dailyTrackingForm: {
    backgroundColor: colors.backgroundLight,
    margin: 15,
    padding: 20,
    borderRadius: 15,
    elevation: 2,
  },
  dailyTrackingInput: {
    marginBottom: 15,
  },
  dailyTrackingSaveButton: {
    marginTop: 10,
    paddingVertical: 8,
  },
});

export default styles;
