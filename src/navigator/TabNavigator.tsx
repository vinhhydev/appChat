import React, {ReactNode} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import ChatScreen from '../screens/ChatScreen';
import StoryScreen from '../screens/StoryScreen';
import FriendsScreen from '../screens/FriendsScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TouchableOpacity} from 'react-native';
import {useNavigation, DrawerActions} from '@react-navigation/native';
import {COLORS} from '../constans/colors';
import {fontFamily} from '../constans/fonts';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const navigation = useNavigation();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerTitleStyle: {
          fontSize: 20,
          fontFamily: fontFamily.FONT_OPENSANS_BOLD,
        },
        headerLeft: () => {
          return (
            <TouchableOpacity
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
              <Icon name="menu" size={25} />
            </TouchableOpacity>
          );
        },
        headerRight: () => {
          let rightIcon: ReactNode;
          switch (route.name) {
            case 'ChatScreen':
              rightIcon = <Icon name="speaker-notes" size={25} />;
              break;
            case 'FriendsScreen':
              rightIcon = <Icon name="contacts" size={25} />;
              break;
            default:
              break;
          }
          return (
            <TouchableOpacity
              onPress={() => {
                route.name === 'FriendsScreen'
                  ? navigation.navigate('ContactScreen' as never)
                  : navigation.navigate('ChatScreen' as never);
              }}>
              {rightIcon}
            </TouchableOpacity>
          );
        },
        headerLeftContainerStyle: {
          paddingLeft: 15,
        },
        headerRightContainerStyle: {
          paddingRight: 15,
        },
        tabBarIcon: ({focused, color}) => {
          let iconTab: ReactNode;
          color = focused ? COLORS.WHITE_COLOR : COLORS.LIGHT_GRAY;
          switch (route.name) {
            case 'ChatScreen':
              iconTab = <Icon name="wechat" size={20} color={color} />;
              break;
            case 'StoryScreen':
              iconTab = <Icon name="bolt" size={20} color={color} />;
              break;
            case 'FriendsScreen':
              iconTab = <Icon name="people" size={20} color={color} />;
              break;
            default:
              break;
          }
          return iconTab;
        },
        tabBarInactiveTintColor: COLORS.LIGHT_GRAY,
        tabBarActiveTintColor: COLORS.WHITE_COLOR,
        tabBarLabelStyle: {
          color: COLORS.WHITE_COLOR,
          fontWeight: 'bold',
        },
        tabBarStyle: {
          backgroundColor: COLORS.PRIMARY_COLOR,
        },
      })}>
      <Tab.Screen
        name="ChatScreen"
        component={ChatScreen}
        options={{headerTitle: 'Đoạn chat', tabBarLabel: 'Đoạn chat'}}
      />
      <Tab.Screen
        name="StoryScreen"
        component={StoryScreen}
        options={{headerTitle: 'Tin nổi bật', tabBarLabel: 'Tin nổi bật'}}
      />
      <Tab.Screen
        name="FriendsScreen"
        component={FriendsScreen}
        options={{headerTitle: 'Bạn bè', tabBarLabel: 'Bạn bè'}}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
