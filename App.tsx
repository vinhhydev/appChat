import 'react-native-gesture-handler';
import {PaperProvider} from 'react-native-paper';
import MainNavigation from './src/navigator/MainNavigation';
import {AuthProvider} from './src/context/AuthContext';
import {LogBox, NativeModules} from 'react-native';
import {Provider} from 'react-redux';
import {store} from './src/redux/store';

LogBox.ignoreLogs([
  "ViewPropTypes will be removed from React Native. Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
  'Non-serializable values were found in the navigation state',
]);

// if (__DEV__) {
//   NativeModules.DevSettings.setIsDebuggingRemotely(false);
// }

const App = () => {
  return (
    <Provider store={store}>
      <AuthProvider>
        <PaperProvider>
          <MainNavigation />
        </PaperProvider>
      </AuthProvider>
    </Provider>
  );
};

export default App;
