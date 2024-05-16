import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import TabNavigator from './TabNavigator';
import {View, Text, TouchableOpacity, Alert} from 'react-native';
import AppText from '../components/AppText';
import {useAuth} from '../context/AuthContext';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: any) => {
  const {logout} = useAuth();
  const handleLogout = async () => {
    const res = await logout();
    if (!res.success) {
      Alert.alert('Thông báo', res.message);
    }
  };
  return (
    <DrawerContentScrollView {...props}>
      <TouchableOpacity onPress={handleLogout}>
        <AppText text="Đăng xuất" />
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="TabScreen" component={TabNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
