import React from 'react';
import {KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
const CustomKeyboardView = ({children}: any) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <ScrollView
        style={{flex: 1}}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CustomKeyboardView;
