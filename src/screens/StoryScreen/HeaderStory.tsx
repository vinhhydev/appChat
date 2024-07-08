import React from 'react';
import {ProfileHeader} from 'react-native-story-view';
import {HeaderProps} from '../../types/storiesType';

const HeaderStory = ({
  userStories,
  multiStoryRef,
  setIsStoryViewShow,
  ...props
}: HeaderProps) => (
  <ProfileHeader
    userImage={{uri: userStories?.profile ?? ''}}
    userName={userStories?.username}
    userMessage={userStories?.title}
    onClosePress={() => {
      multiStoryRef?.current?.close?.();
      setIsStoryViewShow(false);
    }}
    {...props}
  />
);

export default HeaderStory;
