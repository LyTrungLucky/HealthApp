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
  clientsButton: {
    marginTop: 12,
    backgroundColor: colors.textWhite,
  },
  clientsButtonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  searchContainer: {
    padding: 15,
    backgroundColor: colors.backgroundLight,
  },
  rolesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.backgroundLight,
  },
  roleChipFilter: {
    marginRight: 8,
  },
  listContainer: {
    padding: 15,
  },
  expertCard: {
    marginBottom: 15,
    elevation: 2,
  },
  expertHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
    backgroundColor: colors.backgroundDark,
  },
  expertInfo: {
    flex: 1,
  },
  expertName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  roleChip: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    backgroundColor: colors.blueLight,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    flex: 1,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
});

export default styles;
