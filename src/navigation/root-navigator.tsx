import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { LoadingState } from '@/components/loading-state';
import { useI18n } from '@/i18n/i18n-provider';
import { useAuth } from '@/lib/auth/auth-context';
import { AdminBillingScreen } from '@/screens/admin/billing-screen';
import { AdminStudentDetailsScreen } from '@/screens/admin/student-details-screen';
import { AdminStudentsScreen } from '@/screens/admin/students-screen';
import { LoginScreen } from '@/screens/auth/login-screen';
import { CompleteSessionScreen } from '@/screens/coach/complete-session-screen';
import { CoachSessionDetailsScreen } from '@/screens/coach/session-details-screen';
import { CoachTodayScreen } from '@/screens/coach/today-screen';
import { CoachWeekScreen } from '@/screens/coach/week-screen';
import { SettingsScreen } from '@/screens/common/settings-screen';
import { StudentHistoryScreen } from '@/screens/student/history-screen';
import { StudentHomeScreen } from '@/screens/student/home-screen';
import { StudentScheduleScreen } from '@/screens/student/schedule-screen';
import { tokens, useColors } from '@/theme';

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const StudentTabs = createBottomTabNavigator();
const CoachTabs = createBottomTabNavigator();
const CoachStack = createNativeStackNavigator();
const AdminTabs = createBottomTabNavigator();
const AdminStack = createNativeStackNavigator();

type MCIcon = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

function TabBar({
  state,
  descriptors,
  navigation,
}: {
  state: any;
  descriptors: any;
  navigation: any;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingBottom: insets.bottom,
        paddingHorizontal: 8,
        paddingTop: 8,
      }}
    >
      {state.routes.map((route: any, index: number) => {
        const { options } = descriptors[route.key];
        const label = options.title ?? route.name;
        const isFocused = state.index === index;
        const icon: MCIcon = options.tabBarIcon ?? 'circle';

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <View key={route.key} style={{ flex: 1, alignItems: 'center' }}>
            <View
              style={{
                alignItems: 'center',
                paddingVertical: 8,
                paddingHorizontal: 16,
                borderRadius: tokens.radius.lg,
                backgroundColor: isFocused
                  ? colors.isDark ? 'rgba(76,175,80,0.18)' : 'rgba(46,125,50,0.09)'
                  : 'transparent',
              }}
            >
              <MaterialCommunityIcons
                name={icon}
                size={22}
                color={isFocused ? colors.primary : colors.textTertiary}
                onPress={onPress}
              />
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: isFocused ? '700' : '500',
                  color: isFocused ? colors.primary : colors.textTertiary,
                  marginTop: 2,
                  letterSpacing: 0.1,
                }}
                onPress={onPress}
              >
                {label}
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}

function AuthNavigator() {
  const { t } = useI18n();
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: t('auth.login') }} />
    </AuthStack.Navigator>
  );
}

function StudentTabNavigator() {
  const { t } = useI18n();
  const colors = useColors();
  return (
    <StudentTabs.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '800', fontSize: 17, color: colors.text },
        headerShadowVisible: false,
      }}
    >
      <StudentTabs.Screen
        name="StudentHome"
        component={StudentHomeScreen}
        options={{ title: t('nav.home'), tabBarIcon: 'home-outline' } as any}
      />
      <StudentTabs.Screen
        name="StudentSchedule"
        component={StudentScheduleScreen}
        options={{ title: t('nav.schedule'), tabBarIcon: 'calendar-week' } as any}
      />
      <StudentTabs.Screen
        name="StudentHistory"
        component={StudentHistoryScreen}
        options={{ title: t('nav.history'), tabBarIcon: 'history' } as any}
      />
      <StudentTabs.Screen
        name="StudentSettings"
        component={SettingsScreen}
        options={{ title: t('nav.settings'), tabBarIcon: 'cog-outline' } as any}
      />
    </StudentTabs.Navigator>
  );
}

function CoachTabNavigator() {
  const { t } = useI18n();
  const colors = useColors();
  return (
    <CoachTabs.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '800', fontSize: 17, color: colors.text },
        headerShadowVisible: false,
      }}
    >
      <CoachTabs.Screen
        name="CoachToday"
        component={CoachTodayScreen}
        options={{ title: t('nav.today'), tabBarIcon: 'lightning-bolt-outline' } as any}
      />
      <CoachTabs.Screen
        name="CoachWeek"
        component={CoachWeekScreen}
        options={{ title: t('nav.week'), tabBarIcon: 'calendar-week-outline' } as any}
      />
      <CoachTabs.Screen
        name="CoachSettings"
        component={SettingsScreen}
        options={{ title: t('nav.settings'), tabBarIcon: 'cog-outline' } as any}
      />
    </CoachTabs.Navigator>
  );
}

function CoachNavigator() {
  const { t } = useI18n();
  const colors = useColors();
  return (
    <CoachStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '800', fontSize: 17, color: colors.text },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
      }}
    >
      <CoachStack.Screen name="CoachTabs" component={CoachTabNavigator} options={{ headerShown: false }} />
      <CoachStack.Screen name="CoachSessionDetails" component={CoachSessionDetailsScreen} options={{ title: t('coach.details.title') }} />
      <CoachStack.Screen name="CoachSessionComplete" component={CompleteSessionScreen} options={{ title: t('coach.complete.title') }} />
    </CoachStack.Navigator>
  );
}

function AdminTabNavigator() {
  const { t } = useI18n();
  const colors = useColors();
  return (
    <AdminTabs.Navigator
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '800', fontSize: 17, color: colors.text },
        headerShadowVisible: false,
      }}
    >
      <AdminTabs.Screen
        name="AdminBilling"
        component={AdminBillingScreen}
        options={{ title: t('nav.billing'), tabBarIcon: 'cash-multiple' } as any}
      />
      <AdminTabs.Screen
        name="AdminStudents"
        component={AdminStudentsScreen}
        options={{ title: t('nav.students'), tabBarIcon: 'account-group-outline' } as any}
      />
      <AdminTabs.Screen
        name="AdminSettings"
        component={SettingsScreen}
        options={{ title: t('nav.settings'), tabBarIcon: 'cog-outline' } as any}
      />
    </AdminTabs.Navigator>
  );
}

function AdminNavigator() {
  const { t } = useI18n();
  const colors = useColors();
  return (
    <AdminStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTitleStyle: { fontWeight: '800', fontSize: 17, color: colors.text },
        headerShadowVisible: false,
        headerTintColor: colors.primary,
      }}
    >
      <AdminStack.Screen name="AdminTabs" component={AdminTabNavigator} options={{ headerShown: false }} />
      <AdminStack.Screen name="AdminStudentDetails" component={AdminStudentDetailsScreen} options={{ title: t('admin.students.details') }} />
    </AdminStack.Navigator>
  );
}

function RoleNavigator() {
  const { status, user } = useAuth();

  if (status === 'booting') return <LoadingState />;
  if (status !== 'signedIn' || !user) return <AuthNavigator />;
  if (user.role === 'STUDENT') return <StudentTabNavigator />;
  if (user.role === 'COACH' || user.role === 'TRAINER') return <CoachNavigator />;
  return <AdminNavigator />;
}

// Build navigation themes with our brand colours
function buildNavTheme(darkMode: boolean) {
  const base = darkMode ? DarkTheme : DefaultTheme;
  return {
    ...base,
    colors: {
      ...base.colors,
      background: darkMode ? tokens.colors.bgDark : tokens.colors.bg,
      card: darkMode ? tokens.colors.surfaceDark : tokens.colors.surface,
      primary: darkMode ? '#76D97E' : tokens.colors.primaryGreenMid,
      border: darkMode ? tokens.colors.borderDark : tokens.colors.border,
      text: darkMode ? tokens.colors.textPrimaryDark : tokens.colors.textPrimary,
    },
  };
}

export function RootNavigator({ darkMode }: { darkMode: boolean }) {
  return (
    <NavigationContainer theme={buildNavTheme(darkMode)}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="RoleRoot" component={RoleNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}


