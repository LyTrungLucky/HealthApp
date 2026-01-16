import { StyleSheet } from 'react-native';
import colors from '../../themes/colors';

export const styles = StyleSheet.create({
  createReminderContainer: {
    flex: 1,
    backgroundColor: colors.background
  },
  createReminderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 15,
    paddingTop: 50
  },
  createReminderBackButton: {
    padding: 5
  },
  createReminderBackIcon: {
    fontSize: 28,
    color: colors.textWhite,
    fontWeight: 'bold'
  },
  createReminderHeaderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textWhite
  },
  createReminderPlaceholder: {
    width: 38
  },
  createReminderContent: {
    flex: 1
  },
  createReminderCard: {
    margin: 15,
    marginBottom: 0
  },
  createReminderSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15
  },
  createReminderTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10
  },
  createReminderTypeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.borderLight,
    borderWidth: 2,
    borderColor: colors.border
  },
  createReminderTypeButtonActive: {
    backgroundColor: colors.blueLight,
    borderColor: colors.primary
  },
  createReminderTypeLabel: {
    fontSize: 14,
    fontWeight: '600'
  },
  createReminderInput: {
    marginBottom: 15
  },
  createReminderDaysGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  createReminderDayButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border
  },
  createReminderDayButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary
  },
  createReminderDayLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.textSecondary
  },
  createReminderDayLabelActive: {
    color: colors.textWhite
  },
  createReminderSaveButton: {
    margin: 20,
    paddingVertical: 8
  },
});

export default styles;
