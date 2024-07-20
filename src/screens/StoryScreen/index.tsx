import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import RenderItemStory from './RenderItemStory';
import stories from './data';
import {
  MultiStoryContainer,
  StoriesType,
  TransitionMode,
} from 'react-native-story-view';
import HeaderStory from './HeaderStory';
import FooterStory from './FooterStory';
import {COLORS} from '../../constans/colors';
import {useIsFocused} from '@react-navigation/native';
import {useAuth} from '../../context/AuthContext';
import {Helpers} from '../../common';
import {IStories} from '../../types/storiesType';
import BackgroundStory from './BackgroundStory';

const StoryScreen = ({route}: any) => {
  const isFocused = useIsFocused();
  const paramsUriCapture = route?.params?.uriCapture;
  const paramsbackgroundStory = route?.params?.backgroundStory;
  const {user} = useAuth();
  const [isStoryViewVisible, setIsStoryViewShow] = useState(false);
  const [pressedIndex, setPressedIndex] = useState<number>(0);
  const [uriCapture, setUriCapture] = useState(paramsUriCapture);
  const [backgroundStory, setBackgroundStory] = useState(paramsbackgroundStory);

  useEffect(() => {
    if (
      !Helpers.isNullOrUndefined(paramsUriCapture) &&
      paramsUriCapture !== uriCapture
    ) {
      setUriCapture(paramsUriCapture);
      setBackgroundStory(paramsbackgroundStory);
    }
  }, [isFocused]);

  useEffect(() => {
    if (uriCapture) {
      const listStory: IStories[] = [
        {
          id: '0-custom',
          duration: 20,
          isReadMore: false,
          isSeen: false,
          type: backgroundStory.type,
          url: !Helpers.isNullOrUndefined(backgroundStory)
            ? backgroundStory.background
            : uriCapture, // this backround is image or video
          link: !Helpers.isNullOrUndefined(backgroundStory) ? uriCapture : '', // this capture only image
          storyId: stories.length + 1,
        },
      ];

      stories.unshift({
        id: stories.length + 1,
        profile: user?.photoUrl ?? '',
        status: false,
        userName: 'Tin của bạn',
        title: '',
        stories: listStory,
      });
    }
  }, [uriCapture]);

  const openStories = (index: number) => {
    setIsStoryViewShow(true);
    setPressedIndex(index);
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={stories}
        keyExtractor={(_, index) => `itemStory-${index}`}
        renderItem={data => (
          <RenderItemStory data={data} openStory={openStories} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.lstStory}
      />

      {isStoryViewVisible && (
        // add other StoryContainer Props
        <MultiStoryContainer
          visible={isStoryViewVisible}
          onComplete={() => setIsStoryViewShow(false)}
          stories={stories as StoriesType[]}
          renderHeaderComponent={callback => (
            <HeaderStory
              {...callback}
              setIsStoryViewShow={setIsStoryViewShow}
            />
          )}
          customViewStyle={{
            zIndex: 9,
          }}
          renderCustomView={callback => <BackgroundStory {...callback} />}
          backgroundColor={COLORS.TEXT_BLACK_COLOR}
          renderFooterComponent={FooterStory}
          userStoryIndex={pressedIndex}
          transitionMode={TransitionMode.Default}
          viewedStories={[]}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
  },
  lstStory: {
    paddingHorizontal: 5,
  },
});

export default StoryScreen;
