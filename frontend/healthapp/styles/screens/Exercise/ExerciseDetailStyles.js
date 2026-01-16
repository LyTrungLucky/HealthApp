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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.primary,
    padding: 15,
    paddingTop: 50,
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    fontSize: 28,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  placeholder: {
    width: 38,
  },
  content: {
    flex: 1,
  },
  exerciseImage: {
    width: '100%',
    height: 250,
    backgroundColor: colors.backgroundDark,
  },
  titleSection: {
    padding: 20,
    backgroundColor: colors.backgroundLight,
  },
  exerciseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  categoryChip: {
    alignSelf: 'flex-start',
    backgroundColor: colors.blueLight,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: colors.backgroundLight,
    marginTop: 10,
  },
  statBox: {
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  difficultyBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 5,
  },
  difficultyText: {
    fontSize: 14,
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  section: {
    backgroundColor: colors.backgroundLight,
    padding: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  instructions: {
    fontSize: 15,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  videoButton: {
    margin: 20,
    marginBottom: 10,
    backgroundColor: colors.error,
  },
  noVideoText: {
    fontSize: 14,
    color: colors.textLight,
  },
  videoContainer: {
    backgroundColor: colors.backgroundLight,
    marginTop: 10,
    padding: 10,
  },
  video: {
    width: '100%',
    height: 250,
    backgroundColor: '#000'
  },
  openExternButton: {
    marginTop: 10,
    alignSelf: 'flex-end'
  },
  addButton: {
    margin: 20,
    marginTop: 0,
    marginBottom: 30,
    borderColor: colors.primary,
  },
});

export default styles;
