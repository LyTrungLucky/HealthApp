import { StyleSheet } from 'react-native';
import colors from '../../themes/colors';

export const styles = StyleSheet.create({
  statsContainer: {
    flex: 1,
    backgroundColor: colors.background
  },
  statsLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  statsHeader: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 50
  },
  statsHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textWhite
  },
  statsContent: {
    flex: 1
  },
  statsSegmentedButtons: {
    margin: 15
  },
  statsSummaryGrid: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    gap: 10
  },
  statsSummaryCard: {
    flex: 1
  },
  statsSummaryContent: {
    alignItems: 'center',
    padding: 10
  },
  statsSummaryIcon: {
    fontSize: 28,
    marginBottom: 5
  },
  statsSummaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary
  },
  statsSummaryLabel: {
    fontSize: 12,
    color: colors.textSecondary
  },
  statsChartCard: {
    margin: 15
  },
  statsChartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 15
  },
  statsChart: {
    borderRadius: 10
  },
});

export default styles;
