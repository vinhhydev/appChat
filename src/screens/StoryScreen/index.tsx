import {FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
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

const StoryScreen = ({route}: any) => {
  const [isStoryViewVisible, setIsStoryViewShow] = useState(false);
  const {user} = useAuth();
  const [pressedIndex, setPressedIndex] = useState<number>(0);
  const isFocused = useIsFocused();
  const uriCapture = route?.params?.uriCapture;

  useEffect(() => {
    if (isFocused && uriCapture) {
      console.log('URICAPTURE', uriCapture);
      stories.unshift({
        id: stories.length + 1,
        profile: user?.photoUrl ?? '',
        status: false,
        userName: 'Tin của bạn',
        title: '',
        stories: [
          {
            id: 0,
            duration: 20,
            isReadMore: false,
            isSeen: false,
            type: 'image',
            url: uriCapture,
            storyId: stories.length + 1,
          },
        ],
      });
    }
  }, [isFocused]);

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
