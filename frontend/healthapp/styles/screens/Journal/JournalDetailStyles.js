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
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.textSecondary,
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
    backgroundColor: colors.primary,
    padding: 15,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  backText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textWhite,
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    padding: 5,
  },
  actionText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    marginBottom: 15,
    elevation: 2,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  moodContainer: {
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  workoutChip: {
    marginLeft: 10,
  },
  workoutCompleted: {
    backgroundColor: '#e8f5e9',
  },
  workoutNotCompleted: {
    backgroundColor: '#ffebee',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  workoutNotes: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  energyBar: {
    marginTop: 10,
  },
  energyLabel: {
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  energyTrack: {
    height: 10,
    backgroundColor: colors.backgroundDark,
    borderRadius: 5,
    overflow: 'hidden',
  },
  energyFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  journalImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
    marginTop: 10,
  },
  metaInfo: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.backgroundLight,
  },
  actionBtn: {
    flex: 1,
  },
});

export default styles;
