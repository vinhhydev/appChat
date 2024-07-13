import {Modal, Pressable, Text, TouchableOpacity, View} from 'react-native';
import {images} from '../../assets';
import {ErrorImage, ImageLoader, ImageModal} from './components';
import {useImageModal, useImagePreview} from './hooks';
import styles from './Styles';
import type {ImagePreviewProps} from './Types';
import ResizeImage from '../../../ResizeImage';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {SafeAreaView} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {DIMENSIONS} from '../../../../constans/dimensions';
import {Portal} from 'react-native-paper';

const MediaPreview = ({
  type,
  imageSource,
  imageStyle,
  renderHeader,
  pinchZoomEnabled = true,
  doubleTapZoomEnabled = true,
  swipeDownCloseEnabled = true,
  errorImageSource = images.errorImage,
  imageLoaderProps,
  renderImageLoader,
}: ImagePreviewProps) => {
  const {
    modalConfig,
    onPressImage,
    setModalConfig,
    imageRef,
    videoRef,
    touchRef,
    loading,
    setLoading,
    error,
    setError,
    handleProgressTime,
    progressTime,
    setProgressTime,
    loadCurrentTimeVideo,
  } = useImagePreview();
  const {
    onLayout,
    onPressClose,
    modalAnimatedStyle,
    animatedViewRef,
    animatedImageStyle,
    headerOpacityAnimation,
    singleTapEvent,
    doubleTapEvent,
    panGestureEvent,
    pinchGestureEvent,
    progressTimeModal,
    setProgressTimeModal,
  } = useImageModal({
    modalConfig,
    setModalConfig,
    pinchZoomEnabled,
    doubleTapZoomEnabled,
    swipeDownCloseEnabled,
  });
  return (
    <>
      <GestureDetector
        gesture={Gesture.Race(
          singleTapEvent,
          doubleTapEvent,
          Gesture.Simultaneous(panGestureEvent, pinchGestureEvent),
        )}>
        <Animated.View style={[modalAnimatedStyle]}>
          <Animated.View
            ref={animatedViewRef}
            style={[
              animatedImageStyle,
              imageStyle,
              {justifyContent: 'center', alignItems: 'center'},
            ]}>
            <ResizeImage
              // type={type}
              id={type}
              onLayout={onLayout}
              ref={type === 'image' ? imageRef : videoRef}
              source={imageSource}
              style={imageStyle}
              resizeMode={'contain'}
              onProgress={(progress: any) =>
                setProgressTime(progress.currentTime)
              }
              paused={true}
            />
          </Animated.View>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

export default MediaPreview;
