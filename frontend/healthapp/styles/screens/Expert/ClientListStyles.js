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
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 50,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  listContainer: {
    padding: 15,
  },
  clientCard: {
    marginBottom: 10,
  },
  clientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  clientInfo: {
    flex: 1,
  },
  clientName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  clientGoal: {
    color: colors.textSecondary,
  },
  clientWeight: {
    color: colors.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  progressButton: {
    flex: 1,
  },
  chatButton: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default styles;
