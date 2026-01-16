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
  editText: {
    fontSize: 16,
    color: colors.textWhite,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
  bmiCard: {
    backgroundColor: colors.backgroundLight,
    margin: 15,
    padding: 30,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 3,
  },
  bmiLabel: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  bmiValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  bmiStatus: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 10,
  },
  bmiStatusText: {
    fontSize: 16,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  form: {
    padding: 15,
  },
  input: {
    marginBottom: 15,
    backgroundColor: colors.backgroundLight,
  },
  goalSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  goalLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
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
  bmiPreview: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.backgroundLight,
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  previewLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  previewValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginHorizontal: 8,
  },
  previewStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    marginTop: 20,
    marginBottom: 30,
    backgroundColor: colors.primary,
  },
});

export default styles;
