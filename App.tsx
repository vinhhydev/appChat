import React from 'react';
import {PaperProvider} from 'react-native-paper';
import MainNavigation from './src/navigator/MainNavigation';
import {AuthProvider} from './src/context/AuthContext';
import {NativeModules, Platform} from 'react-native';

if (__DEV__) {
  NativeModules.DevSettings.setIsDebuggingRemotely(false);
}
// if (Platform.OS === 'ios') {
//   if (__DEV__) {
//     NativeModules.DevSettings.setIsDebuggingRemotely(false);
//   }
// }

const App = () => {
  return (
    <AuthProvider>
      <PaperProvider>
        <MainNavigation />
      </PaperProvider>
    </AuthProvider>
  );
};

export default App;
