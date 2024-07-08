import {ActivityIndicator, Modal, SafeAreaView, View} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import {useImageModal} from '../hooks';
import type {ImageModalProps} from '../Types';
import Header from './Header';
import {ImageModalStyle} from './styles';
import ResizeImage from '../../../../ResizeImage';

const AnimatedResizeImage = Animated.createAnimatedComponent(ResizeImage);

const ImageModal = ({
  type,
  setModalConfig,
  modalConfig,
  renderHeader,
  imageSource,
  doubleTapZoomEnabled,
  pinchZoomEnabled,
  swipeDownCloseEnabled,
  imageStyle,
}: ImageModalProps) => {
  const styles = ImageModalStyle(
    modalConfig.x,
    modalConfig.y,
    modalConfig.height,
    modalConfig.width,
  );
  const {
    imageAnimatedStyle,
    onPressClose,
    modalAnimatedStyle,
    animatedViewRef,
    animatedImageStyle,
    loading,
    setLoading,
    headerOpacityAnimation,
    doubleTapEvent,
    panGestureEvent,
    pinchGestureEvent,
  } = useImageModal({
    modalConfig,
    setModalConfig,
    pinchZoomEnabled,
    doubleTapZoomEnabled,
    swipeDownCloseEnabled,
  });

  return (
    <Modal visible={modalConfig.visible} transparent>
      <GestureHandlerRootView style={styles.gestureContainer}>
        <GestureDetector
          gesture={Gesture.Race(
            doubleTapEvent,
            Gesture.Simultaneous(panGestureEvent, pinchGestureEvent),
          )}>
          <Animated.View style={[styles.modalContainer, modalAnimatedStyle]}>
            <SafeAreaView style={styles.modalContainer}>
              <Header
                {...{renderHeader, onPressClose, headerOpacityAnimation}}
              />
              {loading && (
                <ActivityIndicator style={styles.activityIndicatorStyle} />
              )}
              <Animated.View
                ref={animatedViewRef}
                style={[
                  animatedImageStyle,
                  styles.imageStyle,
                  {justifyContent: 'center', alignItems: 'center'},
                ]}>
                <ResizeImage
                  // type={type}
                  id={type}
                  // ref={animatedImageRef}
                  source={imageSource}
                  resizeMode={'contain'}
                  style={{width: '100%', height: 'auto'}}
                  onLoadStart={() => {
                    setLoading(true);
                  }}
                  // onLoadEnd={() => {
                  //   setLoading(false);
                  // }}
                />
              </Animated.View>
            </SafeAreaView>
          </Animated.View>
        </GestureDetector>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default ImageModal;
