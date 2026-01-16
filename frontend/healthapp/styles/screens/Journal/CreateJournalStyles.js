import { StyleSheet } from 'react-native';
import colors from '../../themes/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.primary,
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 15,
  },
  backText: {
    color: colors.textWhite,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.textWhite,
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 15,
  },
  card: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    marginBottom: 10,
  },
  moodRow: {
    flexDirection: 'row',
    gap: 10,
  },
  moodButton: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: colors.borderLight,
    minWidth: 80,
  },
  selectedMood: {
    backgroundColor: colors.primary,
  },
  moodEmoji: {
    fontSize: 24,
    marginBottom: 5,
  },
  moodLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  selectedMoodLabel: {
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  energyRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
  },
  energyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.border,
  },
  selectedEnergy: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  energyText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedEnergyText: {
    color: colors.textWhite,
    fontWeight: 'bold',
  },
  imageContainer: {
    position: 'relative',
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    borderRadius: 20,
    padding: 8,
  },
  removeImageText: {
    color: colors.textWhite,
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageButton: {
    marginTop: 10,
  },
  saveButton: {
    margin: 20,
    backgroundColor: colors.primary,
    paddingVertical: 8,
  },
});

export default styles;
