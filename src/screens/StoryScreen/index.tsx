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
import AppText from '../../components/AppText';

const StoryScreen = ({route}: any) => {
  const [isStoryViewVisible, setIsStoryViewShow] = useState(false);
  const {user} = useAuth();
  const [pressedIndex, setPressedIndex] = useState<number>(0);
  const isFocused = useIsFocused();
  const uriCapture = route?.params?.uriCapture;
  const backgroundStory = route?.params?.backgroundStory;
  useEffect(() => {
    if (isFocused && uriCapture) {
      console.log('URICAPTURE', uriCapture);
      const listStory: IStories[] = [
        {
          id: '0-custom',
          duration: 20,
          isReadMore: false,
          isSeen: false,
          type: 'image',
          url: uriCapture, // this capture only image
          storyId: stories.length + 1,
        },
      ];
      if (!Helpers.isNullOrUndefined(backgroundStory)) {
        listStory.push({
          id: `0-background`,
          duration: 20,
          isReadMore: false,
          isSeen: false,
          type: backgroundStory.type,
          url: backgroundStory.background, // this backround is image or video
          storyId: stories.length + 1,
        });
      }

      stories.unshift({
        id: stories.length + 1,
        profile: user?.photoUrl ?? '',
        status: false,
        userName: 'Tin của bạn',
        title: '',
        stories: listStory,
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
          customViewStyle={{
            zIndex: -999,
          }}
          renderCustomView={callback => (
            <View // cai nay nen de thang background
              style={{
                flex: 1,
                position: 'absolute',
                top: 0,
                backgroundColor: 'red',
              }}>
              <AppText
                text={`Hello-${callback?.progressIndex}`}
                textColor="blue"
              />
            </View>
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
