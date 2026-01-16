import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    paddingTop: 50,
    backgroundColor: '#3b5998',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#ffd700',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default styles;
