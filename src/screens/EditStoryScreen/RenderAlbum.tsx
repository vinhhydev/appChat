import {
  ActivityIndicator,
  ListRenderItemInfo,
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
import {useEffect, useState} from 'react';

type PropData = {
  data: ListRenderItemInfo<PhotoIdentifier>;
  itemSize: number;
};

const RenderAlbum = (props: PropData) => {
  const [isLoading, setIsLoading] = useState(true);
  return (
    <View style={{justifyContent: 'center', alignItems: 'center'}}>
      {props.data.item.node.type === 'image' ? (
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
      ) : (
        <View style={{position: 'relative'}}>
          <FastImage
            source={{
              uri: `data:image/jpeg;base64,${props.data.item.node.image.uri}`,
            }}
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
      )}
    </View>
  );
};

export default RenderAlbum;

const styles = StyleSheet.create({
  viewMedia: {
    width: 100,
    height: 100,
  },
});
