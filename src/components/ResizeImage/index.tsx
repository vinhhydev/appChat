import {useState, useEffect, forwardRef, useRef} from 'react';
import {
  Image,
  StyleSheet,
  ImageProps,
  ImageSourcePropType,
  ImageStyle,
  Pressable,
} from 'react-native';
import {createThumbnail} from 'react-native-create-thumbnail';
import Video, {
  ReactVideoProps,
  ReactVideoSource,
  VideoRef,
} from 'react-native-video';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
  const {paused} = props as ResizeVideoProps;
  const [pauseVideo, setPauseVideo] = useState(paused);
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
  }, [isVideo]);
  const handleImageSize = (width: number, height: number) => {
    setAspectRatio(width / height);
  };

  // const handlePauseOrResume = () =>{
  //   if(pauseVideo){

  //   }
  //   setPauseVideo(!pauseVideo)
  // }

  return isVideo ? (
    <>
      <Video
        {...(props as ResizeVideoProps)}
        style={[props.style, {width: '100%', aspectRatio}]}
        resizeMode="contain"
        onEnd={() => {
          setPauseVideo(true);
        }}
        paused={pauseVideo}
        ref={ref}
      />
      {pauseVideo && (
        <Pressable
          style={styles.iconPlay}
          onPress={() => setPauseVideo(!pauseVideo)}>
          <Icon name="play-arrow" size={30} color={'white'} />
        </Pressable>
      )}
    </>
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
  iconPlay: {
    position: 'absolute',
    top: '50%',
    transform: [{translateY: -15}],
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderRadius: 30,
  },
});

export default ResizeImage;
