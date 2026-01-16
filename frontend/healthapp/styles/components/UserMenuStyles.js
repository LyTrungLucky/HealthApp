import { StyleSheet } from 'react-native';
import colors from '../themes/colors';

export const styles = StyleSheet.create({
  userMenuAvatar: {
    backgroundColor: '#e4e6eb',
  },
  userMenuBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  userMenuMenu: {
    position: 'absolute',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    paddingVertical: 8,
    width: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  userMenuItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  userMenuText: {
    fontSize: 16,
  },
  // Alternative names for compatibility
  avatar: {
    backgroundColor: '#e4e6eb',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  menu: {
    position: 'absolute',
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    paddingVertical: 8,
    width: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  item: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  text: {
    fontSize: 16,
  },
});

export default styles;
