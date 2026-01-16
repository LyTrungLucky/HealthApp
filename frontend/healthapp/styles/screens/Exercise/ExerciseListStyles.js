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
  categoriesContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: colors.backgroundLight,
  },
  categoryChip: {
    marginRight: 8,
  },
  listContainer: {
    padding: 15,
  },
  card: {
    marginBottom: 15,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
  },
  exerciseCard: {
    flexDirection: 'row',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
  },
  exerciseImage: {
    width: 120,
    height: 120,
    borderRadius: 8,
    backgroundColor: colors.backgroundDark,
    marginRight: 15,
  },
  exerciseInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  cardInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  exerciseCategory: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  category: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  exerciseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaIcon: {
    fontSize: 16,
    marginRight: 4,
  },
  metaText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 'auto',
  },
  difficultyText: {
    fontSize: 12,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    fontSize: 10,
    color: colors.textLight,
    marginTop: 2,
  },
  categoryText: {
    fontSize: 14,
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
