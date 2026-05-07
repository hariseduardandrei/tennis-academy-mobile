import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

import type { UiLocale } from '@/lib/api/types';

import { translations, type I18nKey } from './translations';

const LOCALE_KEY = 'ta_locale';

interface I18nContextValue {
  locale: UiLocale;
  setLocale: (next: UiLocale) => Promise<void>;
  t: (key: I18nKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function detectDefaultLocale(): UiLocale {
  const lang = Localization.getLocales()[0]?.languageCode?.toLowerCase();
  return lang === 'en' ? 'en' : 'ro';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<UiLocale>('ro');

  useEffect(() => {
    (async () => {
      const stored = await AsyncStorage.getItem(LOCALE_KEY);
      setLocaleState((stored as UiLocale) || detectDefaultLocale());
    })();
  }, []);

  const setLocale = async (next: UiLocale) => {
    setLocaleState(next);
    await AsyncStorage.setItem(LOCALE_KEY, next);
  };

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale,
      t: (key) => translations[locale][key] ?? translations.ro[key] ?? key,
    }),
    [locale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider');
  return ctx;
}

