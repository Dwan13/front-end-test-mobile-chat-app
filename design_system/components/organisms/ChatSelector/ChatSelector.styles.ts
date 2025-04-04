import { StyleSheet } from 'react-native';
import { Theme } from '@/types/tColores';

export const styles = (theme: Theme) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '80%',
    maxHeight: '60%',
    backgroundColor: theme === 'dark' ? '#333' : '#FFF',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    color: theme === 'dark' ? '#FFF' : '#000',
  },
  chatItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'dark' ? '#444' : '#EEE',
  },
  chatName: {
    fontSize: 16,
    color: theme === 'dark' ? '#FFF' : '#000',
  },

});