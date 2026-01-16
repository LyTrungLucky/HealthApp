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
    marginTop: 10,
  },
  modeButton: {
    flex: 1,
    padding: 15,
    borderRadius: 12,
    backgroundColor: colors.backgroundLight,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
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
    fontWeight: 'bold',
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioLabel: {
    fontSize: 15,
    color: colors.textPrimary,
    marginLeft: 10,
  },
  templateButton: {
    marginTop: 15,
  },
  input: {
    marginBottom: 15,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 10,
  },
  halfInput: {
    flex: 1,
  },
  caloriesSummary: {
    backgroundColor: colors.backgroundLight,
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  caloriesItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  caloriesLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  caloriesValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countChip: {
    backgroundColor: colors.blueLight,
  },
  recommendedLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  foodList: {
    gap: 10,
  },
  foodItem: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: colors.backgroundLight,
    borderWidth: 2,
    borderColor: colors.border,
    marginBottom: 10,
  },
  foodItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.blueLight,
  },
  foodInfo: {
    flex: 1,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  foodMeal: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 3,
  },
  foodNutrition: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  weekdayRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 10,
  },
  weekdayChip: {
    height: 32,
    backgroundColor: colors.backgroundDark,
  },
  weekdayChipActive: {
    backgroundColor: colors.primary,
  },
  saveButton: {
    margin: 20,
    paddingVertical: 8,
    backgroundColor: colors.primary,
  },
});

export default styles;
