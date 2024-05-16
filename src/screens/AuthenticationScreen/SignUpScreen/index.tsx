import {
  Alert,
  Keyboard,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import AppText from '../../../components/AppText';
import Icon from 'react-native-vector-icons/Ionicons';
import {styles} from '../styles';
import {COLORS} from '../../../constans/colors';
import CustomKeyboardView from '../../../components/CustomKeyboardView';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import CustomTextInput from '../../../components/CustomTextInput';
import {useAuth} from '../../../context/AuthContext';

type FormData = {
  userName: string;
  email: string;
  password: string;
  rePassword: string;
};

const SignUpScreen = () => {
  const navigation = useNavigation();
  const {register} = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [showRePass, setShowRePass] = useState(false);
  const {control, handleSubmit} = useForm<FormData>();
  const onSinUp = handleSubmit(async data => {
    if (data.password !== data.rePassword) {
      Alert.alert('Thông báo', 'Nhập lại mật khẩu không đúng');
      return;
    }
    let response = await register(data.userName, data.email, data.password);
    if (!response.success) {
      Alert.alert('Thông báo', response.mess);
    }
  });

  return (
    <CustomKeyboardView>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[styles.container, styles.containerSignUp]}>
          <AppText text="Tạo tài khoản mới" textFont="bold" textSize={18} />
          <CustomTextInput
            useHookForm
            textInputProps={{
              label: 'Họ và tên',
              style: styles.ipText,
              placeholderTextColor: COLORS.PLACEHOLDER_TEXT_INPUT_COLOR,
              keyboardType: 'name-phone-pad',
              returnKeyType: 'next',
              mode: 'outlined',
            }}
            controllerProps={{control: control, name: 'userName'}}
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
          <CustomTextInput
            useHookForm
            textInputProps={{
              label: 'Nhập lại mật khẩu',
              style: styles.ipText,
              placeholderTextColor: COLORS.PLACEHOLDER_TEXT_INPUT_COLOR,
              keyboardType: 'default',
              returnKeyType: 'send',
              secureTextEntry: !showRePass,
              mode: 'outlined',
            }}
            rightIconName={!showRePass ? 'eye' : 'eye-off'}
            rightIconOnPress={() => {
              setShowRePass(!showRePass);
              Keyboard.dismiss();
            }}
            controllerProps={{control: control, name: 'rePassword'}}
          />

          <TouchableOpacity
            style={[styles.btnView, styles.btnLogin]}
            onPress={onSinUp}>
            <AppText
              text="Đăng ký"
              textColor={COLORS.WHITE_COLOR}
              textFont="bold"
            />
          </TouchableOpacity>
          <View style={styles.txtToLogin}>
            <AppText text="Đã có tài khoản? " textSize={13} />
            <TouchableOpacity
              onPress={() => navigation.navigate('SignIn' as never)}>
              <AppText
                text="Đăng nhập"
                textColor={COLORS.TEXT_SIGNUP}
                textFont="bold"
                textSize={13}
              />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </CustomKeyboardView>
  );
};

export default SignUpScreen;
