import React from 'react';
import {Control, Controller} from 'react-hook-form';
import AppText from '../AppText';
import {COLORS} from '../../constans/colors';
import {TextInput, TextInputProps} from 'react-native-paper';
import {StyleSheet} from 'react-native';
import {Helpers} from '../../common';
import {DIMENSIONS} from '../../constans/dimensions';
import Icon from 'react-native-vector-icons/FontAwesome';
type ControllerProps = {
  control: Control<any, any>;
  name: string;
};

type PropTextInput = {
  controllerProps: ControllerProps;
  //text input props
  textInputProps: TextInputProps;
  useHookForm: boolean;
  leftIconName?: string;
  leftIconOnPress?: () => void;
  rightIconName?: string;
  rightIconOnPress?: () => void;
};

const CustomTextInput = (props: PropTextInput) => {
  return props.useHookForm ? (
    <Controller
      {...props.controllerProps}
      render={({field: {onChange, value}, fieldState: {error, invalid}}) => (
        <>
          <TextInput
            {...props.textInputProps}
            onChangeText={onChange}
            value={value}
            numberOfLines={1}
            theme={{colors: {primary: COLORS.TEXT_BLACK_COLOR}}}
            style={[props.textInputProps.style, styles.txtInput]}
            error={invalid}
            right={
              !Helpers.isNullOrUndefined(props.rightIconName) && (
                <TextInput.Icon
                  icon={props.rightIconName ?? ''}
                  onPress={props.rightIconOnPress}
                />
              )
            }
            left={
              !Helpers.isNullOrUndefined(props.leftIconName) && (
                <TextInput.Icon
                  icon={props.leftIconName ?? ''}
                  onPress={props.leftIconOnPress}
                />
              )
            }
          />
        </>
      )}
      rules={{required: true}}
    />
  ) : (
    <TextInput
      {...props.textInputProps}
      style={[props.textInputProps.style, styles.txtInput]}
    />
  );
};

const styles = StyleSheet.create({
  txtInput: {
    width: DIMENSIONS.width * 0.9,
    backgroundColor: COLORS.WHITE_COLOR,
    borderColor: 'red',
  },
});

export default CustomTextInput;
