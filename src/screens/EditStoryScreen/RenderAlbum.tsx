import {
  ActivityIndicator,
  ListRenderItemInfo,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import {
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import FastImage from 'react-native-fast-image';
import Video from 'react-native-video';
import AppText from '../../components/AppText';
import {COLORS} from '../../constans/colors';
import {useEffect, useMemo, useState} from 'react';
import {useNavigation} from '@react-navigation/native';

interface Photo extends PhotoIdentifier {
  linkVideo?: string;
}
type PropData = {
  data: ListRenderItemInfo<Photo>;
  itemSize: number;
};

const RenderAlbum = (props: PropData) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(true);
  const type = useMemo(() => {
    console.log('props', props.data.item.node);
    return props.data.item.node.type.includes('video') ? 'video' : 'image';
  }, []);

  return (
    <Pressable
      style={{justifyContent: 'center', alignItems: 'center'}}
      onPress={() => {
        navigation.navigate({
          name: 'EditDetailStoryScreen',
          params: {
            background:
              type === 'image'
                ? props.data.item.node.image.uri
                : props.data.item.linkVideo,
            type: type,
          },
        } as never);
      }}>
      {type === 'video' ? (
        <View style={{position: 'relative'}}>
          <FastImage
            source={
              Platform.OS === 'ios'
                ? {
                    uri: `data:image/jpeg;base64,${props.data.item.node.image.uri}`,
                  }
                : {uri: props.data.item.node.image.uri}
            }
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            resizeMode="cover"
            style={{width: props.itemSize, height: props.itemSize}}
          />
          <AppText
            text={`0:${Math.round(
              props.data.item.node.image.playableDuration,
            ).toString()}`}
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              fontWeight: 700,
              paddingHorizontal: 3,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}
            textColor={COLORS.WHITE_COLOR}
          />
          {isLoading && (
            <ActivityIndicator
              style={{position: 'absolute', top: '50%', left: '50%'}}
            />
          )}
        </View>
      ) : (
        <>
          <FastImage
            source={{
              uri: props.data.item.node.image.uri,
            }}
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
            resizeMode="cover"
            style={{width: props.itemSize, height: props.itemSize}}
          />

          {isLoading && (
            <ActivityIndicator
              style={{position: 'absolute', top: '50%', left: '50%'}}
            />
          )}
        </>
      )}
    </Pressable>
  );
};

export default RenderAlbum;

const styles = StyleSheet.create({
  viewMedia: {
    width: 100,
    height: 100,
  },
});
