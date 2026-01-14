/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NewAppScreen } from '@react-native/new-app-screen';
import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/context/AuthContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import Toast from 'react-native-toast-message';
import { useSupabaseDeepLinkHandler } from './src/hooks/useSupabaseDeepLinkHandler';
import { navigationRef } from './src/navigation/NavigationRef';

const linking = {
  prefixes: ["authflow://"],
  config: {
    screens: {
      ResetPassword: "reset-password",
    },
  },
};
function App() {

  return <AuthProvider>
    <AppContent />
  </AuthProvider>;
}

function AppContent() {
  const isDarkMode = useColorScheme() === 'dark';
  useSupabaseDeepLinkHandler();
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <NavigationContainer ref={navigationRef} linking={linking}>
        <RootNavigator />
        <Toast />
      </NavigationContainer>
    </SafeAreaProvider>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
