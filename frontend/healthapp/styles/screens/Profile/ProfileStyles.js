import { StyleSheet } from 'react-native';
import colors from '../../themes/colors';

export const styles = StyleSheet.create({
  profileContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  profileHeader: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 50,
  },
  profileHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
  profileContent: {
    flex: 1,
  },
  profileUserCard: {
    backgroundColor: colors.backgroundLight,
    padding: 30,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  profileAvatar: {
    marginBottom: 15,
    backgroundColor: colors.backgroundDark,
  },
  profileUserName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 5,
  },
  profileUserRole: {
    fontSize: 14,
    color: colors.primary,
    marginBottom: 5,
    fontWeight: '600',
  },
  profileUserEmail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  profileSection: {
    backgroundColor: colors.backgroundLight,
    marginTop: 15,
    paddingVertical: 5,
  },
  profileSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textSecondary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  profileListItem: {
    paddingVertical: 5,
  },
  profileLogoutButton: {
    backgroundColor: colors.error,
    margin: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
  },
  profileLogoutText: {
    color: colors.textWhite,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default styles;
