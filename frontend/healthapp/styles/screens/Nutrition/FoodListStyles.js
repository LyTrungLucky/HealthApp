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
  searchContainer: {
    padding: 15,
    backgroundColor: colors.backgroundLight,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: colors.background,
  },
  mealTypesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.backgroundLight,
  },
  mealTypeChip: {
    marginRight: 8,
  },
  mealTypeText: {
    fontSize: 14,
  },
  listContainer: {
    padding: 15,
  },
  foodCard: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  foodImage: {
    width: 120,
    height: 120,
    backgroundColor: colors.backgroundDark,
  },
  foodInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  mealType: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  nutritionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  nutritionItem: {
    alignItems: 'center',
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  nutritionLabel: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textLight,
  },
});

export default styles;
