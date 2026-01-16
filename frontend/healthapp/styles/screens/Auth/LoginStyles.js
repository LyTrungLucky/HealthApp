import { StyleSheet } from 'react-native';
import colors from '../../themes/colors';

export const styles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loginScrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  loginHeader: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  loginTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 8,
  },
  loginSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  loginFormContainer: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loginErrorText: {
    marginBottom: 10,
  },
  loginInput: {
    marginBottom: 15,
  },
  loginButton: {
    marginTop: 10,
    paddingVertical: 8,
    backgroundColor: colors.primary,
  },
  loginRegisterContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginRegisterText: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  loginRegisterLink: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default styles;
