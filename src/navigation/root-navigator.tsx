import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

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

const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const StudentTabs = createBottomTabNavigator();
const CoachTabs = createBottomTabNavigator();
const CoachStack = createNativeStackNavigator();
const AdminTabs = createBottomTabNavigator();
const AdminStack = createNativeStackNavigator();

function AuthNavigator() {
  const { t } = useI18n();
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ title: t('auth.login') }} />
    </AuthStack.Navigator>
  );
}

function StudentTabNavigator() {
  const { t } = useI18n();
  return (
    <StudentTabs.Navigator>
      <StudentTabs.Screen
        name="StudentHome"
        component={StudentHomeScreen}
        options={{ title: t('nav.home') }}
      />
      <StudentTabs.Screen
        name="StudentSchedule"
        component={StudentScheduleScreen}
        options={{ title: t('nav.schedule') }}
      />
      <StudentTabs.Screen
        name="StudentHistory"
        component={StudentHistoryScreen}
        options={{ title: t('nav.history') }}
      />
      <StudentTabs.Screen
        name="StudentSettings"
        component={SettingsScreen}
        options={{ title: t('nav.settings') }}
      />
    </StudentTabs.Navigator>
  );
}

function CoachTabNavigator() {
  const { t } = useI18n();
  return (
    <CoachTabs.Navigator>
      <CoachTabs.Screen
        name="CoachToday"
        component={CoachTodayScreen}
        options={{ title: t('nav.today') }}
      />
      <CoachTabs.Screen
        name="CoachWeek"
        component={CoachWeekScreen}
        options={{ title: t('nav.week') }}
      />
      <CoachTabs.Screen
        name="CoachSettings"
        component={SettingsScreen}
        options={{ title: t('nav.settings') }}
      />
    </CoachTabs.Navigator>
  );
}

function CoachNavigator() {
  const { t } = useI18n();
  return (
    <CoachStack.Navigator>
      <CoachStack.Screen
        name="CoachTabs"
        component={CoachTabNavigator}
        options={{ headerShown: false }}
      />
      <CoachStack.Screen
        name="CoachSessionDetails"
        component={CoachSessionDetailsScreen}
        options={{ title: t('coach.details.title') }}
      />
      <CoachStack.Screen
        name="CoachSessionComplete"
        component={CompleteSessionScreen}
        options={{ title: t('coach.complete.title') }}
      />
    </CoachStack.Navigator>
  );
}

function AdminTabNavigator() {
  const { t } = useI18n();
  return (
    <AdminTabs.Navigator>
      <AdminTabs.Screen
        name="AdminBilling"
        component={AdminBillingScreen}
        options={{ title: t('nav.billing') }}
      />
      <AdminTabs.Screen
        name="AdminStudents"
        component={AdminStudentsScreen}
        options={{ title: t('nav.students') }}
      />
      <AdminTabs.Screen
        name="AdminSettings"
        component={SettingsScreen}
        options={{ title: t('nav.settings') }}
      />
    </AdminTabs.Navigator>
  );
}

function AdminNavigator() {
  const { t } = useI18n();
  return (
    <AdminStack.Navigator>
      <AdminStack.Screen name="AdminTabs" component={AdminTabNavigator} options={{ headerShown: false }} />
      <AdminStack.Screen
        name="AdminStudentDetails"
        component={AdminStudentDetailsScreen}
        options={{ title: t('admin.students.details') }}
      />
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

export function RootNavigator({ darkMode }: { darkMode: boolean }) {
  return (
    <NavigationContainer theme={darkMode ? DarkTheme : DefaultTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="RoleRoot" component={RoleNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}


