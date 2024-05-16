import React from 'react';
import {
  Animated,
  GestureResponderEvent,
  StyleProp,
  Text,
  TextStyle,
} from 'react-native';
import {COLORS} from '../../constans/colors';
import {fontFamily} from '../../constans/fonts';

interface PropertyText {
  style?: StyleProp<TextStyle>;
  disabled?: boolean;
  key?: React.Key;
  allowFontScaling?: boolean;
  numberOfLines?: number;
  ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip' | undefined;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  ref?: React.LegacyRef<Text> | undefined;
  refAnimated?: React.Ref<Text | Animated.LegacyRef<Text>> | undefined;
  text?: string;
  textFont?: string;
  textColor?: string;
  textAlign?: 'auto' | 'center' | 'justify' | 'left' | 'right' | undefined;
  textSize?: number;
  animated?: boolean;
}

const AppText = (props: PropertyText) => {
  const appFont = 'regular';
  const defaultFont = (font: string) => {
    switch (font) {
      case 'bold':
        return fontFamily.FONT_OPENSANS_BOLD;
      case 'bold-italic':
        return fontFamily.FONT_OPENSANS_BOLDITALIC;
      case 'extra-bold':
        return fontFamily.FONT_OPENSANS_EXTRABOLD;
      case 'extra-bold-italic':
        return fontFamily.FONT_OPENSANS_EXTRABOLDITALIC;
      case 'italic':
        return fontFamily.FONT_OPENSANS_ITALIC;
      case 'light':
        return fontFamily.FONT_OPENSANS_LIGHT;
      case 'light-italic':
        return fontFamily.FONT_OPENSANS_LIGHTITALIC;
      case 'medium':
        return fontFamily.FONT_OPENSANS_MEDIUM;
      case 'medium-italic':
        return fontFamily.FONT_OPENSANS_MEDIUMITALIC;
      default:
        return fontFamily.FONT_OPENSANS_REGULAR;
    }
  };
  return !props.animated ? (
    <Text
      style={[
        {
          color: props.textColor ? props.textColor : COLORS.TEXT_BLACK_COLOR,
          fontSize: props.textSize ? props.textSize : 14,
          includeFontPadding: false,
          fontFamily: defaultFont(
            props?.textFont !== undefined ? props?.textFont : appFont,
          ),
          textAlign: props?.textAlign ? props.textAlign : 'justify',
        },
        props?.style,
      ]}
      disabled={props?.disabled}
      key={props?.key}
      allowFontScaling={props?.allowFontScaling}
      numberOfLines={props?.numberOfLines}
      ellipsizeMode={props?.ellipsizeMode}
      onPress={props?.onPress}
      ref={props?.ref}>
      {props?.text}
    </Text>
  ) : (
    <Animated.Text
      style={[
        {
          color: props.textColor ? props.textColor : COLORS.TEXT_BLACK_COLOR,
          fontSize: props.textSize ? props.textSize : 14,
          includeFontPadding: false,
          fontFamily: defaultFont(
            props?.textFont !== undefined ? props?.textFont : appFont,
          ),
          textAlign: props?.textAlign ? props.textAlign : 'justify',
        },
        props?.style,
      ]}
      disabled={props?.disabled}
      key={props?.key}
      allowFontScaling={props?.allowFontScaling}
      numberOfLines={props?.numberOfLines}
      ellipsizeMode={props?.ellipsizeMode}
      onPress={props?.onPress}
      ref={props?.refAnimated}>
      {props?.text}
    </Animated.Text>
  );
};

export default AppText;