import { StyleSheet } from 'react-native';
import colors from '../../themes/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 15,
    paddingTop: 50,
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    fontSize: 28,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  placeholder: {
    width: 38,
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 15,
    marginBottom: 0,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15,
  },
  modeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modeButton: {
    flex: 1,
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    backgroundColor: colors.background,
    borderWidth: 2,
    borderColor: colors.border,
  },
  modeButtonActive: {
    backgroundColor: colors.blueLight,
    borderColor: colors.primary,
  },
  modeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  modeText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  modeTextActive: {
    color: colors.primary,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radioLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  templateButton: {
    marginTop: 15,
  },
  input: {
    marginBottom: 15,
  },
  exerciseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  countChip: {
    backgroundColor: colors.secondary,
  },
  recommendedLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  exerciseList: {
    marginTop: 10,
  },
  exerciseItem: {
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  exerciseItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.blueLight,
  },
  exerciseInfo: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  exerciseMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  weekdayChip: {
    marginBottom: 5,
  },
  weekdayChipActive: {
    backgroundColor: colors.primary,
  },
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  goalButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.borderLight,
    borderWidth: 2,
    borderColor: colors.border,
  },
  goalButtonActive: {
    backgroundColor: colors.blueLight,
    borderColor: colors.primary,
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    margin: 20,
    paddingVertical: 8,
  },
});

export default styles;
