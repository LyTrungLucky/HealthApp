import { StyleSheet } from 'react-native';
import colors from '../../themes/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 50
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textWhite
  },
  listContainer: {
    padding: 15
  },
  card: {
    marginBottom: 10
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  icon: {
    fontSize: 32,
    marginRight: 15
  },
  info: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginVertical: 5
  },
  days: {
    fontSize: 12,
    color: colors.textSecondary
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center'
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 15
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center'
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.primary
  },
});

export default styles;
