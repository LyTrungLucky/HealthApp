import { StyleSheet } from 'react-native';
import colors from '../../themes/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  padding: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 30,
  },
  margin: {
    marginBottom: 15,
  },
  imagePicker: {
    backgroundColor: colors.backgroundLight,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 15,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginVertical: 15,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  center: {
    alignItems: 'center',
    marginTop: 20,
  },
});

export default styles;
