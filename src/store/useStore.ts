import AsyncStorage from '@react-native-async-storage/async-storage';

export const getItem = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const setItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(error);
  }
};

export const removeItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};