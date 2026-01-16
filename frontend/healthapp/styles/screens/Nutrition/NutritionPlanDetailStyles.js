import { StyleSheet } from 'react-native';
import colors from '../../themes/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    backgroundColor: colors.backgroundLight,
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.border
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.textPrimary
  },
  goalChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    backgroundColor: colors.primary
  },
  metaText: {
    color: colors.textSecondary,
    fontSize: 14
  },
  createdBy: {
    color: colors.textSecondary,
    marginTop: 6,
    fontStyle: 'italic',
    fontSize: 13
  },
  calorieText: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    color: colors.orange
  },
  section: {
    padding: 16
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.textPrimary
  },
  sectionContent: {
    color: colors.textSecondary,
    lineHeight: 20
  },
  mealCard: {
    marginBottom: 12,
    elevation: 2
  },
  foodName: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary
  },
  weekdayChip: {
    height: 28
  },
  meta: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: 4
  },
  notes: {
    marginTop: 6,
    color: colors.textPrimary,
    fontSize: 13
  },
  weekdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    marginBottom: 8
  },
  weekdayTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4
  },
  countText: {
    color: colors.textWhite,
    fontWeight: '700',
    fontSize: 12
  },
  dayItems: {
    marginBottom: 12
  },
  dayBlock: {
    marginBottom: 12
  },
});

export default styles;
