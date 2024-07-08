import React, {useState, useEffect, forwardRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageProps,
  ImageSourcePropType,
  ImageStyle,
  Pressable,
} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import Video, {ReactVideoProps, ReactVideoSource} from 'react-native-video';

interface ResizeImageProps extends Omit<ImageProps, 'source'> {
  source: ImageSourcePropType;
}

interface ResizeVideoProps extends Omit<ReactVideoProps, 'source'> {
  source: ReactVideoSource;
}

// interface Resize extends ResizeImageProps, ResizeVideoProps {
//   type: 'image' | 'video',

// }

type ResizeMediaProps = ResizeVideoProps | ResizeImageProps;

const ResizeImage = forwardRef<any, ResizeMediaProps>((props, ref) => {
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [thumnailVideo, setThumnailVideo] = useState('');
  const [playVideo, setPlayVideo] = useState(false);
  const isVideo = props.id === 'video';

  useEffect(() => {
    if (!isVideo) {
      const {source} = props as ResizeImageProps;
      if (typeof source === 'number') {
        // Local image
        const {width, height} = Image.resolveAssetSource(source);
        handleImageSize(width, height);
      } else if (source && 'uri' in source) {
        // Remote image
        if (source?.uri !== '') {
          Image.getSize(source?.uri!, handleImageSize, () => {
            console.log('Failed to get image size');
          });
        }
      }
    } else {
      const {source} = props as ResizeVideoProps;
      if (source && source.uri) {
        createThumbnail({url: source.uri as string, timeStamp: 5000})
          .then(response => {
            console.log('THUM');
            // if (!playVideo) {
            //   setThumnailVideo(response.path);
            // }
            Image.getSize(response.path, handleImageSize, () => {
              console.error('Failed to get video thumbnail size');
            });
          })
          .catch(err => {
            console.error('Error creating thumbnail', err);
          });
      }
    }
  }, [props, isVideo]);
  const handleImageSize = (width: number, height: number) => {
    setAspectRatio(width / height);
  };
  return isVideo ? (
    <Video
      {...(props as ResizeVideoProps)}
      style={[props.style, {width: '100%', aspectRatio}]}
      resizeMode="contain"
      paused={false}
      ref={ref}
    />
  ) : (
    <Image
      {...(props as ResizeImageProps)}
      style={[props?.style as ImageStyle, {width: '100%', aspectRatio}]}
      resizeMode="contain"
      ref={ref}
    />
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ResizeImage;
