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
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 15,
    paddingTop: 50,
  },
  backButton: {
    fontSize: 28,
    color: colors.textWhite,
    marginRight: 15,
  },
  headerInfo: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  headerGoal: {
    color: colors.backgroundLight,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
    padding: 15,
  },
  chip: {
    backgroundColor: colors.backgroundDark,
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.textPrimary,
  },
  chipTextSelected: {
    color: colors.textWhite,
  },
  card: {
    margin: 15,
    marginTop: 0,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.textPrimary,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statTarget: {
    color: colors.success,
  },
  statBmi: {
    color: colors.orange,
  },
  statLabel: {
    color: colors.textSecondary,
  },
  chart: {
    borderRadius: 10,
  },
  analysisBox: {
    backgroundColor: colors.background,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  analysisBoxWater: {
    backgroundColor: colors.blueLight,
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  analysisBoxSteps: {
    backgroundColor: colors.successLight,
    padding: 10,
    borderRadius: 8,
  },
  analysisTitle: {
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  analysisValue: {
    marginTop: 5,
  },
  analysisSubtext: {
    color: colors.textSecondary,
    marginTop: 5,
  },
  textSuccess: {
    color: colors.success,
  },
  textDanger: {
    color: colors.danger,
  },
  textNeutral: {
    color: colors.textSecondary,
  },
  actionContainer: {
    padding: 15,
    gap: 10,
  },
  actionButton: {
    backgroundColor: colors.success,
  },
});

export default styles;
