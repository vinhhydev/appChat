import React from 'react'
import { View, SafeAreaView } from 'react-native'
import LottieView from "lottie-react-native";
import { lottieLink } from '../../constans/lottieLink';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
const LoginScreen = () => {
  return (
    <SafeAreaView>
      <LottieView
      source={lottieLink.lottieLogin}
      style={{height:hp(30)}}
      autoPlay
      loop
    />
      <View>

      </View>
    </SafeAreaView>
  )
}

export default LoginScreen