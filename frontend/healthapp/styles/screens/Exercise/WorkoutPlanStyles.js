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
  planCard: {
    marginBottom: 15,
    elevation: 2,
  },
  card: {
    marginBottom: 15,
    elevation: 2,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  planName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    flex: 1,
    marginRight: 10,
  },
  goalChip: {
    height: 28,
  },
  goalText: {
    fontSize: 12,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  planDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
    lineHeight: 20,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 15,
    lineHeight: 20,
  },
  planMeta: {
    marginBottom: 10,
  },
  meta: {
    marginBottom: 10,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  metaIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  createdBy: {
    fontSize: 12,
    color: colors.textLight,
    fontStyle: 'italic',
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 15,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textLight,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: colors.secondary,
  },
});

export default styles;
