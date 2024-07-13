import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import {COLORS} from '../../constans/colors';
import {DIMENSIONS} from '../../constans/dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';

interface IHeader {
  rightHeader?: JSX.Element;
  iconGoBackRight?: boolean;
  titleHeader?: JSX.Element;
  styleTitle?: StyleProp<ViewStyle>;
  styleTextTitle?: StyleProp<TextStyle>;
  leftHeader?: JSX.Element;
  styleHeader?: StyleProp<ViewStyle>;
}

const Header = (props: IHeader) => {
  const navigation = useNavigation();
  return (
    <View style={[styles.container, props.styleHeader]}>
      <View style={styles.leftHeader}>
        {props.iconGoBackRight && (
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={30} />
          </TouchableOpacity>
        )}
        {props.leftHeader}
      </View>
      <View style={[styles.titleHeader, props.styleTitle]}>
        {props.titleHeader}
      </View>
      <View style={styles.rightHeader}>{props.rightHeader}</View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE_COLOR,
    flexDirection: 'row',
    width: DIMENSIONS.width,
    height: 60,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftHeader: {
    width: DIMENSIONS.width * 0.2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleHeader: {
    width: DIMENSIONS.width * 0.6,
    flexDirection: 'row',
  },
  rightHeader: {
    width: DIMENSIONS.width * 0.2,
    flexDirection: 'row',
  },
});
