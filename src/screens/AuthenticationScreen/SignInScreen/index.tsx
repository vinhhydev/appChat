import React, {useState} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import AppText from '../../../components/AppText';
import {styles} from '../styles';
import {COLORS} from '../../../constans/colors';
import {IMAGES} from '../../../constans/images';
import {useNavigation} from '@react-navigation/native';
import CustomTextInput from '../../../components/CustomTextInput';
import {Keyboard} from 'react-native';
import {useForm} from 'react-hook-form';
import {useAuth} from '../../../context/AuthContext';

type FormData = {
  email: string;
  password: string;
};

const SignInScreen = () => {
  const navigation = useNavigation();
  const {login, handleLoginWithFacebook, handleLoginWithGoogle} = useAuth();
  const [showPass, setShowPass] = useState(false);
  const {control, handleSubmit} = useForm<FormData>();

  const onLogin = handleSubmit(async data => {
    const res = await login(data.email, data.password);
    if (!res?.success) {
      Alert.alert('Thông báo', res?.mess);
    }
  });
  const onLoginWithFacebook = async () => {
    const res = await handleLoginWithFacebook();
    if (res?.success) {
      Alert.alert('Đăng nhập thành công');
    }
  };
  const onLoginWithGoogle = async () => {
    const res = await handleLoginWithGoogle();
    if (res?.success) {
    }
  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <AppText
          text="Đăng nhập vào RING"
          textFont="bold"
          textSize={18}
          style={{marginBottom: 20}}
        />
        <CustomTextInput
          useHookForm
          textInputProps={{
            label: 'Email',
            style: styles.ipText,
            placeholderTextColor: COLORS.PLACEHOLDER_TEXT_INPUT_COLOR,
            keyboardType: 'email-address',
            returnKeyType: 'next',
            mode: 'outlined',
          }}
          controllerProps={{control: control, name: 'email'}}
        />
        <CustomTextInput
          useHookForm
          textInputProps={{
            label: 'Mật khẩu',
            style: styles.ipText,
            placeholderTextColor: COLORS.PLACEHOLDER_TEXT_INPUT_COLOR,
            keyboardType: 'default',
            returnKeyType: 'next',
            secureTextEntry: !showPass,
            mode: 'outlined',
          }}
          rightIconName={!showPass ? 'eye' : 'eye-off'}
          rightIconOnPress={() => {
            setShowPass(!showPass);
            Keyboard.dismiss();
          }}
          controllerProps={{control: control, name: 'password'}}
        />
        <TouchableOpacity
          style={[styles.btnView, styles.btnLogin]}
          onPress={onLogin}>
          <AppText
            text="Đăng nhập"
            textColor={COLORS.WHITE_COLOR}
            textFont="bold"
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.viewSignup}
          onPress={() => navigation.navigate('SignUp' as never)}>
          <AppText
            text="Đăng ký tài khoản mới"
            textColor={COLORS.TEXT_SIGNUP}
            textFont="bold"
            textSize={13}
          />
        </TouchableOpacity>
        <View style={styles.viewLoginOther}>
          <View style={styles.txtOther}>
            <View style={styles.line} />
            <AppText text="Hoặc" textColor={COLORS.LIGHT_GRAY} />
            <View style={styles.line} />
          </View>
          <TouchableOpacity
            style={[styles.btnView, styles.btnLoginGoogle]}
            onPress={onLoginWithGoogle}>
            <Image
              source={IMAGES.icon_google}
              resizeMode="contain"
              style={styles.imgBtn}
            />
            <AppText text="Tiếp tục với Google" textFont="bold" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.btnView, styles.btnLoginFacebook]}
            onPress={onLoginWithFacebook}>
            <Image
              source={IMAGES.icon_facebook}
              style={styles.imgBtn}
              resizeMode="contain"
            />
            <AppText
              text="Tiếp tục với Facebook"
              textColor={COLORS.WHITE_COLOR}
              textFont="bold"
            />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default SignInScreen;
