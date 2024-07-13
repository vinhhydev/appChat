import {
  ImageBackground,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import AppText from '../../components/AppText';
import {DIMENSIONS} from '../../constans/dimensions';
import {IStories, IUserStories} from '../../types/storiesType';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import {COLORS} from '../../constans/colors';
import {useAppSelector} from '../../redux/hook';
import {IMAGES} from '../../constans/images';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useEffect, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

type PropsData = {
  openStory: (index: number) => void;
  data: ListRenderItemInfo<IUserStories>;
};

const RenderItemStory = (props: PropsData) => {
  const {user} = useAppSelector(state => state.user);
  const navigation = useNavigation();
  return (
    <View style={{flexDirection: 'row', alignSelf: 'flex-start'}}>
      {props.data.index === 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('EditStoryScreen' as never)}>
          <ImageBackground
            style={styles.itemView}
            resizeMode="cover"
            source={
              user.photoUrl.length > 0
                ? {
                    uri: user.photoUrl,
                  }
                : IMAGES.avatar_user_default
            }>
            <View style={styles.btnPlus}>
              <Icon name="add" size={20} />
            </View>
            <AppText
              text="Thêm vào tin"
              textColor={COLORS.WHITE_COLOR}
              textFont="bold"
              style={{
                alignSelf: 'center',
                textAlign: 'center',
                textShadowColor: 'black',
                textShadowOffset: {width: 2, height: 0},
                textShadowRadius: 5,
              }}
            />
          </ImageBackground>
        </TouchableOpacity>
      )}
      <TouchableOpacity
        onPress={() => {
          props.openStory(props.data.index);
        }}>
        {props.data.item.stories[0].type === 'image' ? (
          <ImageBackground
            style={styles.itemView}
            source={{uri: props.data.item.stories[0].url}}>
            <View style={styles.viewAvatar}>
              <View style={styles.avatar}>
                <FastImage
                  source={{uri: props.data.item.profile}}
                  resizeMode="cover"
                  style={styles.imageAvatar}
                />
                <View style={styles.dotStatus} />
              </View>
              <View style={styles.countStories}>
                <AppText
                  text={props.data.item.stories.length.toString()}
                  textColor={COLORS.WHITE_COLOR}
                />
              </View>
            </View>
            <AppText
              text={props.data.item.userName}
              style={styles.txtuserName}
              numberOfLines={2}
            />
          </ImageBackground>
        ) : (
          <View style={styles.itemView}>
            <Video
              source={{uri: props.data.item.stories[0].url}}
              style={styles.viewVideo}
              paused
              resizeMode="cover"
              poster={props.data.item.stories[0].url}
            />
            <View style={styles.viewAvatar}>
              <View style={styles.avatar}>
                <FastImage
                  source={{uri: props.data.item.profile}}
                  resizeMode="cover"
                  style={styles.imageAvatar}
                />
                <View style={styles.dotStatus} />
              </View>
              <View style={styles.countStories}>
                <AppText
                  text={props.data.item.stories.length.toString()}
                  textColor={COLORS.WHITE_COLOR}
                />
              </View>
            </View>
            <AppText
              text={props.data.item.userName}
              style={styles.txtuserName}
              numberOfLines={2}
            />
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default RenderItemStory;

const styles = StyleSheet.create({
  itemView: {
    width: DIMENSIONS.width * 0.3 - 10,
    aspectRatio: 1 / 1.6,
    marginHorizontal: 5,
    position: 'relative',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  viewVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: DIMENSIONS.width * 0.3 - 10,
    aspectRatio: 1 / 1.6,
    borderRadius: 8,
  },
  btnPlus: {
    backgroundColor: COLORS.WHITE_COLOR,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    borderRadius: 40,
  },
  viewAvatar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  avatar: {
    position: 'relative',
    width: 30,
    height: 30,
  },
  imageAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  dotStatus: {
    width: 10,
    height: 10,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.WHITE_COLOR,
    backgroundColor: COLORS.GREEN_ONLINE_COLOR,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  countStories: {
    backgroundColor: 'rgba(0,0,0, 0.4)',
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  txtuserName: {
    alignSelf: 'center',
    color: COLORS.WHITE_COLOR,
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'black',
    textShadowOffset: {width: 2, height: 0},
    textShadowRadius: 5,
  },
});
