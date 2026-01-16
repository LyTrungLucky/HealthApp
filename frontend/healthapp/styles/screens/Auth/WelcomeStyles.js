import { StyleSheet, Dimensions } from 'react-native';
import colors from '../../themes/colors';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  imageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: width * 0.5,
    height: height * 0.2,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textWhite,
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#e0e0e0',
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    color: '#d0d0d0',
    textAlign: 'center',
    lineHeight: 22,
  },
  featuresContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 20,
  },
  feature: {
    alignItems: 'center',
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 5,
  },
  featureText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
  },
  loginButton: {
    paddingVertical: 8,
    backgroundColor: colors.backgroundLight,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  registerButton: {
    paddingVertical: 8,
    borderColor: colors.textWhite,
    borderWidth: 2,
  },
  registerButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textWhite,
  },
});

export default styles;
