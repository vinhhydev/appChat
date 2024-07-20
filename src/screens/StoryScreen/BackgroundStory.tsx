import {StyleSheet, Text, View} from 'react-native';
import React, {useMemo} from 'react';
import {CallbackProps} from 'react-native-story-view';
import AppText from '../../components/AppText';
import {CustomProps} from '../../types/storiesType';
import Video from 'react-native-video';
import {Helpers} from '../../common';
import {ImageBackground} from 'react-native';
import {DIMENSIONS} from '../../constans/dimensions';
import {moderateScale} from '../../theme';

const BackgroundStory = ({userStories, story, progressIndex}: CustomProps) => {
  return (
    <ImageBackground
      source={{uri: story?.[progressIndex!].link}}
      resizeMode="contain"
      style={{
        width: DIMENSIONS.width,
        height: DIMENSIONS.height,
        marginTop: -moderateScale(40),
      }}
    />
  );
};

export default BackgroundStory;

const styles = StyleSheet.create({});
