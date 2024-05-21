import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import React from 'react';
import TabNavigator from './TabNavigator';
import {TouchableOpacity, Alert, StyleSheet, Image, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AppText from '../components/AppText';
import {useAuth} from '../context/AuthContext';
import {Helpers} from '../common';
import {IMAGES} from '../constans/images';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const {logout, user} = useAuth();
  const handleLogout = async () => {
    const res = await logout();
    if (!res.success) {
      Alert.alert('Thông báo', res.message);
    }
  };
  return (
    <DrawerContentScrollView {...props} style={styles.containerDrawer}>
      <View style={styles.boxAvatar}>
        <Image
          source={
            Helpers.isNullOrUndefined(user?.photoUrl)
              ? IMAGES.avatar_user_default
              : {uri: user?.photoUrl}
          }
          style={styles.imageAvatar}
        />
        <AppText text={user?.userName ?? ''} textSize={20} />
      </View>
      <TouchableOpacity onPress={handleLogout}>
        <AppText text="Đăng xuất" />
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{headerShown: false}}
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="TabScreen" component={TabNavigator} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  containerDrawer: {
    paddingHorizontal: 10,
  },
  boxAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageAvatar: {
    width: '50%',
    height: hp(15),
    borderRadius: 0,
    marginBottom: 15,
  },
});

export default DrawerNavigator;
