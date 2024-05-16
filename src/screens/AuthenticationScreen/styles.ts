import {Platform, StyleSheet} from 'react-native';
import {DIMENSIONS} from '../../constans/dimensions';
import {COLORS} from '../../constans/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export const styles = StyleSheet.create({
  container: {
    width: DIMENSIONS.width,
    height: DIMENSIONS.height,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.WHITE_COLOR,
    paddingHorizontal: 20,
  },
  containerSignUp: {
    paddingTop: Platform.OS === 'ios' ? 60 : 0,
  },
  viewInput: {
    width: DIMENSIONS.width * 0.9,
    marginVertical: 10,
    borderWidth: 0.5,
    borderRadius: 10,
    borderColor: COLORS.TEXT_BLACK_COLOR,
  },
  ipText: {
    marginVertical: 10,
  },
  viewSignup: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
  },
  viewLoginOther: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtOther: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: DIMENSIONS.width * 0.8,
    marginVertical: 20,
  },
  line: {
    borderTopWidth: 0.5,
    borderColor: COLORS.LIGHT_GRAY,
    width: '50%',
    marginHorizontal: 10,
  },

  btnView: {
    width: DIMENSIONS.width * 0.9,
    paddingVertical: hp(2.3),
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  btnLogin: {
    backgroundColor: COLORS.PRIMARY_COLOR,
    marginVertical: 15,
  },
  btnLoginGoogle: {
    backgroundColor: COLORS.WHITE_COLOR,
    borderWidth: 0.5,
    marginVertical: 15,
  },
  btnLoginFacebook: {
    backgroundColor: COLORS.FACEBOOK_COLOR,
  },
  imgBtn: {
    width: 25,
    height: 25,
  },
  txtToLogin: {
    flexDirection: 'row',
  },
});
