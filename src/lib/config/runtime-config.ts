import AsyncStorage from '@react-native-async-storage/async-storage';

const OVERRIDE_KEY = 'ta_api_base_override';

const envUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

export async function getApiBaseUrl(): Promise<string> {
  const override = await AsyncStorage.getItem(OVERRIDE_KEY);
  if (override && override.trim().length > 0) return override.trim().replace(/\/$/, '');

  return (envUrl && envUrl.trim().length > 0 ? envUrl : 'http://localhost:8080').replace(/\/$/, '');
}

export async function getApiBaseUrlOverride(): Promise<string> {
  return (await AsyncStorage.getItem(OVERRIDE_KEY)) ?? '';
}

export async function setApiBaseUrlOverride(url: string): Promise<void> {
  const cleaned = url.trim();
  if (!cleaned) {
    await AsyncStorage.removeItem(OVERRIDE_KEY);
    return;
  }
  await AsyncStorage.setItem(OVERRIDE_KEY, cleaned.replace(/\/$/, ''));
}

