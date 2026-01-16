import { StyleSheet } from 'react-native';
import colors from '../../themes/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.backgroundLight,
    padding: 16,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  goalChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    backgroundColor: colors.secondary,
    color: colors.textWhite,
  },
  metaText: {
    color: colors.textSecondary,
  },
  createdBy: {
    color: colors.textLight,
    marginTop: 6,
    fontStyle: 'italic',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sectionContent: {
    color: colors.textPrimary,
    lineHeight: 20,
  },
  scheduleCard: {
    marginBottom: 12,
  },
  scheduleHeader: {
    marginBottom: 8,
  },
  exerciseCard: {
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 15,
    fontWeight: '600',
  },
  weekdayChip: {
    height: 28,
  },
  meta: {
    color: colors.textSecondary,
  },
  notes: {
    marginTop: 6,
    color: colors.textPrimary,
  },
  weekdayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    backgroundColor: colors.backgroundLight,
    borderRadius: 8,
    marginBottom: 8,
  },
  weekdayTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  countBadge: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  countText: {
    color: colors.textWhite,
    fontWeight: '700',
  },
  dayItems: {
    marginBottom: 12,
  },
  dayBlock: {
    marginBottom: 12,
  },
});

export default styles;
