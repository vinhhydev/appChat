import React from 'react';
import {PaperProvider} from 'react-native-paper';
import MainNavigation from './src/navigator/MainNavigation';
import {AuthProvider} from './src/context/AuthContext';

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
