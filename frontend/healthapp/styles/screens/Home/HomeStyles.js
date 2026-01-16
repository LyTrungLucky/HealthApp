import { StyleSheet } from 'react-native';
import colors from '../../themes/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  homeLoadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.primary,
    paddingTop: 50,
  },
  greeting: {
    fontSize: 16,
    color: colors.backgroundLight,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  summaryCard: {
    margin: 15,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.textPrimary,
  },
  healthInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  healthItem: {
    alignItems: 'center',
  },
  healthLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  healthValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  infoText: {
    color: colors.textSecondary,
    marginBottom: 15,
    textAlign: 'center',
  },
  createButton: {
    marginTop: 10,
  },
  trackingCard: {
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 3,
  },
  trackingGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trackingItem: {
    alignItems: 'center',
  },
  trackingIcon: {
    fontSize: 32,
    marginBottom: 5,
  },
  trackingValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  trackingLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  quickActions: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.textPrimary,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionCard: {
    width: '48%',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  actionIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  actionSubtitle: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});

export default styles;
