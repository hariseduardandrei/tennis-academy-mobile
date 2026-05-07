import { MD3DarkTheme, MD3LightTheme, useTheme, type MD3Theme } from 'react-native-paper';

// ─── Design Tokens ─────────────────────────────────────────────────────────────
export const tokens = {
  colors: {
    // Brand (mirrors web palette)
    primaryGreen: '#1B5E20',
    primaryGreenMid: '#2E7D32',
    primaryGreenLight: '#43A047',
    primaryBlue: '#01579B',
    primaryBlueMid: '#0277BD',
    primaryBlueLight: '#0288D1',

    // Light surfaces
    bg: '#F2F6FA',
    surface: '#FFFFFF',
    surfaceElevated: '#F8FBFF',
    border: 'rgba(0,0,0,0.07)',
    borderStrong: 'rgba(0,0,0,0.13)',

    // Dark surfaces
    bgDark: '#0D1117',
    surfaceDark: '#161B22',
    surfaceElevatedDark: '#1E2530',
    borderDark: 'rgba(255,255,255,0.09)',
    borderStrongDark: 'rgba(255,255,255,0.17)',

    // Text light
    textPrimary: '#0D1117',
    textSecondary: '#57606A',
    textTertiary: '#8B949E',

    // Text dark
    textPrimaryDark: '#E6EDF3',
    textSecondaryDark: '#8B949E',
    textTertiaryDark: '#6E7681',

    // Attendance status
    present: '#1B5E20',
    presentBg: '#E8F5E9',
    presentBgDark: 'rgba(27,94,32,0.22)',
    late: '#E65100',
    lateBg: '#FFF3E0',
    lateBgDark: 'rgba(230,81,0,0.22)',
    absent: '#B71C1C',
    absentBg: '#FFEBEE',
    absentBgDark: 'rgba(183,28,28,0.22)',

    // Billing status
    paid: '#1B5E20',
    paidBg: '#E8F5E9',
    due: '#E65100',
    dueBg: '#FFF3E0',
    waived: '#546E7A',
    waivedBg: '#ECEFF1',
    waivedBgDark: 'rgba(84,110,122,0.22)',

    // Session type
    tennis: '#1B5E20',
    tennisBg: '#E8F5E9',
    tennisBgDark: 'rgba(27,94,32,0.22)',
    fitness: '#BF360C',
    fitnessBg: '#FBE9E7',
    fitnessBgDark: 'rgba(191,54,12,0.22)',
    matchplay: '#1A237E',
    matchplayBg: '#E8EAF6',
    matchplayBgDark: 'rgba(26,35,126,0.22)',
  },
  radius: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 20,
    xl: 28,
    full: 999,
  },
  shadow: {
    sm: { boxShadow: '0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)' as const },
    md: { boxShadow: '0 4px 14px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)' as const },
    lg: { boxShadow: '0 8px 28px rgba(0,0,0,0.11), 0 4px 8px rgba(0,0,0,0.06)' as const },
    smDark: { boxShadow: '0 1px 4px rgba(0,0,0,0.35)' as const },
    mdDark: { boxShadow: '0 4px 14px rgba(0,0,0,0.45)' as const },
    lgDark: { boxShadow: '0 8px 28px rgba(0,0,0,0.55)' as const },
  },
  gradient: {
    brand: ['#1B5E20', '#01579B'] as [string, string],
    brandMid: ['#2E7D32', '#0277BD'] as [string, string],
    greenSoft: ['#E8F5E9', '#F1F8E9'] as [string, string],
    blueAccent: ['#E3F2FD', '#EDE7F6'] as [string, string],
    dark: ['#0D1117', '#161B22'] as [string, string],
    darkCard: ['#161B22', '#1E2530'] as [string, string],
  },
  motion: {
    fast: 160,
    normal: 260,
    slow: 400,
  },
} as const;

// ─── Reactive colour helper ─────────────────────────────────────────────────────
export function useColors() {
  const theme = useTheme();
  const isDark = theme.dark;
  return {
    isDark,
    bg: isDark ? tokens.colors.bgDark : tokens.colors.bg,
    surface: isDark ? tokens.colors.surfaceDark : tokens.colors.surface,
    surfaceElevated: isDark ? tokens.colors.surfaceElevatedDark : tokens.colors.surfaceElevated,
    border: isDark ? tokens.colors.borderDark : tokens.colors.border,
    borderStrong: isDark ? tokens.colors.borderStrongDark : tokens.colors.borderStrong,
    text: isDark ? tokens.colors.textPrimaryDark : tokens.colors.textPrimary,
    textSecondary: isDark ? tokens.colors.textSecondaryDark : tokens.colors.textSecondary,
    textTertiary: isDark ? tokens.colors.textTertiaryDark : tokens.colors.textTertiary,
    shadow: isDark ? tokens.shadow.mdDark : tokens.shadow.md,
    shadowSm: isDark ? tokens.shadow.smDark : tokens.shadow.sm,
    shadowLg: isDark ? tokens.shadow.lgDark : tokens.shadow.lg,
    primary: isDark ? '#76D97E' : tokens.colors.primaryGreenMid,
    primaryStrong: isDark ? '#4CAF50' : tokens.colors.primaryGreen,
    secondary: isDark ? '#8DCDFF' : tokens.colors.primaryBlueMid,
    gradientBrand: tokens.gradient.brand,
  };
}

// ─── Session / status helpers ───────────────────────────────────────────────────
export function sessionTypeStyle(type: string, isDark: boolean) {
  switch (type) {
    case 'TENNIS':
      return {
        accent: tokens.colors.tennis,
        bg: isDark ? tokens.colors.tennisBgDark : tokens.colors.tennisBg,
      };
    case 'FITNESS':
      return {
        accent: tokens.colors.fitness,
        bg: isDark ? tokens.colors.fitnessBgDark : tokens.colors.fitnessBg,
      };
    case 'MATCHPLAY':
      return {
        accent: tokens.colors.matchplay,
        bg: isDark ? tokens.colors.matchplayBgDark : tokens.colors.matchplayBg,
      };
    default:
      return { accent: '#546E7A', bg: isDark ? 'rgba(84,110,122,0.2)' : '#ECEFF1' };
  }
}

export function attendanceStyle(status: string | undefined, isDark: boolean) {
  switch (status) {
    case 'PRESENT':
      return {
        color: tokens.colors.present,
        bg: isDark ? tokens.colors.presentBgDark : tokens.colors.presentBg,
      };
    case 'LATE':
      return {
        color: tokens.colors.late,
        bg: isDark ? tokens.colors.lateBgDark : tokens.colors.lateBg,
      };
    case 'ABSENT':
      return {
        color: tokens.colors.absent,
        bg: isDark ? tokens.colors.absentBgDark : tokens.colors.absentBg,
      };
    default:
      return { color: '#757575', bg: isDark ? 'rgba(117,117,117,0.2)' : '#F5F5F5' };
  }
}

export function billingStyle(status: string, isDark: boolean) {
  switch (status) {
    case 'PAID':
      return {
        color: tokens.colors.paid,
        bg: isDark ? tokens.colors.presentBgDark : tokens.colors.paidBg,
      };
    case 'DUE':
      return {
        color: tokens.colors.due,
        bg: isDark ? tokens.colors.lateBgDark : tokens.colors.dueBg,
      };
    case 'WAIVED':
      return {
        color: tokens.colors.waived,
        bg: isDark ? tokens.colors.waivedBgDark : tokens.colors.waivedBg,
      };
    default:
      return { color: '#757575', bg: '#F5F5F5' };
  }
}

// ─── RN Paper MD3 Themes ────────────────────────────────────────────────────────
export const lightTheme: MD3Theme = {
  ...MD3LightTheme,
  roundness: 4,
  colors: {
    ...MD3LightTheme.colors,
    primary: tokens.colors.primaryGreenMid,
    onPrimary: '#FFFFFF',
    primaryContainer: '#E8F5E9',
    onPrimaryContainer: tokens.colors.primaryGreen,
    secondary: tokens.colors.primaryBlueMid,
    onSecondary: '#FFFFFF',
    secondaryContainer: '#E3F2FD',
    onSecondaryContainer: tokens.colors.primaryBlue,
    tertiary: '#6A1B9A',
    surface: tokens.colors.surface,
    onSurface: tokens.colors.textPrimary,
    surfaceVariant: '#F0F7F1',
    onSurfaceVariant: tokens.colors.textSecondary,
    background: tokens.colors.bg,
    onBackground: tokens.colors.textPrimary,
    outline: tokens.colors.border,
    outlineVariant: tokens.colors.borderStrong,
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: 'transparent',
      level1: tokens.colors.surfaceElevated,
      level2: '#F2F8F3',
      level3: '#EDF5EE',
      level4: '#EAF3EB',
      level5: '#E7F1E8',
    },
  },
};

export const darkTheme: MD3Theme = {
  ...MD3DarkTheme,
  roundness: 4,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#76D97E',
    onPrimary: '#003910',
    primaryContainer: '#00521A',
    onPrimaryContainer: '#9DF0A5',
    secondary: '#8DCDFF',
    onSecondary: '#003257',
    secondaryContainer: '#004880',
    onSecondaryContainer: '#BDE5FF',
    tertiary: '#CE93D8',
    surface: tokens.colors.surfaceDark,
    onSurface: tokens.colors.textPrimaryDark,
    surfaceVariant: tokens.colors.surfaceElevatedDark,
    onSurfaceVariant: tokens.colors.textSecondaryDark,
    background: tokens.colors.bgDark,
    onBackground: tokens.colors.textPrimaryDark,
    outline: tokens.colors.borderDark,
    outlineVariant: tokens.colors.borderStrongDark,
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: 'transparent',
      level1: tokens.colors.surfaceDark,
      level2: tokens.colors.surfaceElevatedDark,
      level3: '#232F3D',
      level4: '#263443',
      level5: '#293849',
    },
  },
};

