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
  image: {
    width: '100%',
    height: 250,
    backgroundColor: colors.backgroundDark,
  },
  titleSection: {
    padding: 20,
    backgroundColor: colors.backgroundLight,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  mealTypeChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.orangeLight,
  },
  nutritionContainer: {
    backgroundColor: colors.backgroundLight,
    padding: 20,
    marginTop: 10,
  },
  calorieBox: {
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 20,
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
  },
  calorieLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 5,
  },
  macrosContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  macroBox: {
    alignItems: 'center',
    flex: 1,
  },
  macroBar: {
    height: 8,
    borderRadius: 4,
    marginBottom: 8,
    alignSelf: 'stretch',
    marginHorizontal: 10,
  },
  macroValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  macroLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.backgroundLight,
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  recipe: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  addButton: {
    margin: 20,
    marginTop: 10,
    marginBottom: 30,
    backgroundColor: colors.primary,
  },
});

export default styles;
