import React from 'react';
import {NavigationContainer, useNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import DrawerNavigator from './DrawerNavigator';
import SignUpScreen from '../screens/AuthenticationScreen/SignUpScreen';
import SignInScreen from '../screens/AuthenticationScreen/SignInScreen';
import {useAuth} from '../context/AuthContext';
import ContactScreen from '../screens/ContactScreen';
import {TouchableOpacity} from 'react-native';
import AppText from '../components/AppText';
import {COLORS} from '../constans/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {fontFamily} from '../constans/fonts';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  const {isLogin, handlePresentModalPress} = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {!isLogin ? (
          <>
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="DrawerScreen" component={DrawerNavigator} />
            <Stack.Screen
              name="ContactScreen"
              component={ContactScreen}
              options={({navigation}) => ({
                presentation: 'modal',
                headerShown: true,
                title: 'Danh bạ',
                headerTitleStyle: {
                  fontSize: 20,
                  fontFamily: fontFamily.FONT_OPENSANS_BOLD,
                },

                headerRight: () => {
                  return (
                    <TouchableOpacity onPress={navigation.goBack}>
                      <AppText
                        text="Xong"
                        textColor={COLORS.FACEBOOK_COLOR}
                        textSize={15}
                      />
                    </TouchableOpacity>
                  );
                },
                headerLeft: () => {
                  return (
                    <TouchableOpacity onPress={handlePresentModalPress}>
                      <Icon name="person-add-alt-1" size={25} />
                    </TouchableOpacity>
                  );
                },
              })}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigation;
