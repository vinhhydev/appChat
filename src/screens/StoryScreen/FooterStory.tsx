import React from 'react';
import {Alert, Keyboard} from 'react-native';
import {Footer as StoryFooter} from 'react-native-story-view';
import {FooterProps} from '../../types/storiesType';

const FooterStory = ({userStories, story, progressIndex}: FooterProps) => (
  <StoryFooter
    onSendTextPress={() => {
      Alert.alert(
        `Đã gửi tin nhắn đến ${userStories?.username} id ${
          story?.[progressIndex!].id
        }`,
      );
      Keyboard.dismiss();
    }}
  />
);

export default FooterStory;
