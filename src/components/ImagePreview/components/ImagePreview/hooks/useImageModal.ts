import {useEffect, useState} from 'react';
import {Platform, useWindowDimensions} from 'react-native';
import {Gesture} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {StaticValues} from '../../../constants';
import {Colors} from '../../../theme';
import type {UseImageModalProps} from '../Types';
import Video from 'react-native-video';

const useImageModal = ({
  modalConfig,
  setModalConfig,
  pinchZoomEnabled,
  doubleTapZoomEnabled,
  swipeDownCloseEnabled,
}: UseImageModalProps) => {
  const WINDOW_HEIGHT =
    Platform.OS === 'ios'
      ? useWindowDimensions().height - 60
      : useWindowDimensions().height;
  const WINDOW_WIDTH = useWindowDimensions().width;
  const animatedViewRef = useAnimatedRef<Animated.View>();
  const [loading, setLoading] = useState<boolean>(false);

  const offset = useSharedValue(0);
  const colorOffset = useSharedValue(0);
  const scale = useSharedValue(1);
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const saveScale = useSharedValue(1);
  const currentInit = {
    x: modalConfig.x,
    y: modalConfig.y,
  };
  const oldTranslateX = useSharedValue(modalConfig.x);
  const oldTranslateY = useSharedValue(modalConfig.y);
  const top = useSharedValue(modalConfig.y);
  const left = useSharedValue(modalConfig.x);
  const imageHeight = useSharedValue(modalConfig.height);
  const imageWidth = useSharedValue(modalConfig.width);

  useEffect(() => {
    if (modalConfig.visible) {
      offset.value = withTiming(1, {}, () => {
        oldTranslateX.value = withTiming(0, {duration: 500});
        oldTranslateY.value = withTiming(0, {duration: 500});
        top.value = withTiming(0, {duration: 500});
        left.value = withTiming(0, {duration: 500});
        imageHeight.value = withTiming(WINDOW_HEIGHT, {duration: 500});
        imageWidth.value = withTiming(WINDOW_WIDTH, {duration: 500});
        colorOffset.value = withTiming(1);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * function use to close the modal
   */
  const onPressClose = () => {
    colorOffset.value = withTiming(0);
    offset.value = withTiming(0, {}, () => {
      runOnJS(setModalConfig)({
        x: 0,
        y: 0,
        width: 0,
        height: 0,
        visible: false,
      });
    });
  };

  /**
   * This function use to update translate and scale values
   * @param newTranslateX
   * @param newTranslateY
   * @param newScale
   */
  const updateTranslate = (
    newTranslateX: number,
    newTranslateY: number,
    newScale: number,
  ) => {
    'worklet';
    const maxTranslateX =
      (WINDOW_WIDTH * newScale - WINDOW_WIDTH) / (newScale * 2);
    const minTranslateX = -maxTranslateX;

    const maxTranslateY =
      (WINDOW_HEIGHT * newScale - WINDOW_HEIGHT) / (newScale * 2);
    const minTranslateY = -maxTranslateY;

    if (newTranslateX > maxTranslateX) {
      translateX.value = maxTranslateX;
    } else if (newTranslateX < minTranslateX) {
      translateX.value = minTranslateX;
    } else {
      translateX.value = newTranslateX;
    }

    if (newTranslateY > maxTranslateY) {
      translateY.value = maxTranslateY;
    } else if (newTranslateY < minTranslateY) {
      translateY.value = minTranslateY;
    } else {
      translateY.value = newTranslateY;
    }
  };

  /**
   * This function is used to reset all position and scale values
   */
  const resetValues = () => {
    'worklet';
    scale.value = withTiming(1);
    translateY.value = withTiming(0);
    translateX.value = withTiming(0);
    saveScale.value = withTiming(1);
    oldTranslateX.value = withTiming(0);
    oldTranslateY.value = withTiming(0);
  };

  /**
   * Pan gesture handler use to move the image after zoom and swipe down to close modal
   */
  const panGestureEvent = Gesture.Pan()
    .onUpdate(eventData => {
      if (scale.value > 1) {
        const newTranslateX = eventData.translationX + oldTranslateX.value;
        const newTranslateY = eventData.translationY + oldTranslateY.value;
        updateTranslate(newTranslateX, newTranslateY, scale.value);
      } else {
        if (swipeDownCloseEnabled && eventData.translationY > 0) {
          // colorOffset.value -= StaticValues.colorOpacityThreshold;
          translateY.value = eventData.translationY / 2 + oldTranslateY.value;
          scale.value =
            saveScale.value -
            (eventData.translationY / 2 + oldTranslateY.value) / 1500;
        }
      }
    })
    .onEnd(() => {
      if (swipeDownCloseEnabled) {
        // colorOffset.value = withTiming(0);
        if (scale.value <= 0.9) {
          //revert animate and close modal
          console.log(modalConfig);

          translateX.value = withTiming(currentInit.x, {
            duration: 500,
          });
          translateY.value = withTiming(currentInit.y, {
            duration: 500,
          });
          scale.value = withTiming(1, {duration: 500});
          imageHeight.value = withTiming(modalConfig.height, {duration: 500});
          imageWidth.value = withTiming(
            modalConfig.width,
            {duration: 500},
            () => {
              runOnJS(setModalConfig)({
                x: 0,
                y: 0,
                width: 0,
                height: 0,
                visible: false,
              });
            },
          );
        } else if (scale.value > 0.8 && scale.value <= 1) {
          scale.value = withTiming(1);
          translateX.value = withTiming(oldTranslateX.value);
          translateY.value = withTiming(oldTranslateY.value);
        } else if (scale.value === 2) {
          oldTranslateX.value = translateX.value;
          oldTranslateY.value = translateY.value;
        }
      }
    });

  /**
   * Tap gesture handler use to double tap to zoom in/out
   */
  const doubleTapEvent = Gesture.Tap()
    .numberOfTaps(2)
    .enabled(doubleTapZoomEnabled ?? true)
    .onEnd(eventData => {
      if (scale.value !== 1) {
        resetValues();
      } else {
        scale.value = withTiming(2);
        saveScale.value = 2;
        translateX.value = withTiming((WINDOW_WIDTH / 2 - eventData.x) / 2);
        translateY.value = withTiming(
          (WINDOW_HEIGHT / 2 - eventData.y + 60) / 2,
        );
        oldTranslateX.value = (WINDOW_WIDTH / 2 - eventData.x) / 2;
        oldTranslateY.value = (WINDOW_HEIGHT / 2 - eventData.y) / 2;
      }
    });

  /**
   * Pinch gestures handler for pinch to zoom in/out
   */
  const pinchGestureEvent = Gesture.Pinch()
    .enabled(pinchZoomEnabled ?? true)
    .onChange(eventData => {
      const updatedScale = saveScale.value * eventData.scale;
      if (updatedScale < 1) {
        resetValues();
      } else {
        scale.value = updatedScale;
        const newTranslateX = oldTranslateX.value;
        const newTranslateY = oldTranslateY.value;
        updateTranslate(newTranslateX, newTranslateY, updatedScale);
      }
    })
    .onEnd(() => {
      saveScale.value = scale.value;
      oldTranslateX.value = translateX.value;
      oldTranslateY.value = translateY.value;
      if (scale.value < 1.1) {
        resetValues();
      }
    });

  /**
   * Use to update scale, top and left position of image
   */
  const animatedImageStyle = useAnimatedStyle(() => ({
    height: imageHeight.value,
    width: imageWidth.value,
    transform: [
      {
        scale: scale.value,
      },
      {translateX: translateX.value},
      {translateY: translateY.value},
    ],
    top: top.value,
    left: left.value,
  }));

  /**
   * Use to animate the modal background
   */
  const modalAnimatedStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      colorOffset.value,
      [0, 1],
      [Colors.transparent, Colors.white],
    ),
  }));

  /**
   * Use to animate size and position of image
   */
  const imageAnimatedStyle = useAnimatedStyle(() => ({
    height: interpolate(
      offset.value,
      [0, 1],
      [modalConfig.height, WINDOW_HEIGHT],
    ),
    width: interpolate(offset.value, [0, 1], [modalConfig.width, WINDOW_WIDTH]),
    top: interpolate(offset.value, [0, 1], [modalConfig.y, translateY.value]),
    left: interpolate(offset.value, [0, 1], [modalConfig.x, translateX.value]),
  }));

  /**
   * Use to animate the header opacity
   */
  const headerOpacityAnimation = useAnimatedStyle(() => ({
    opacity: interpolate(colorOffset.value, [0, 1], [0, 1]),
  }));

  return {
    loading,
    setLoading,
    onPressClose,
    animatedViewRef,
    imageAnimatedStyle,
    modalAnimatedStyle,
    animatedImageStyle,
    headerOpacityAnimation,
    panGestureEvent,
    pinchGestureEvent,
    doubleTapEvent,
  };
};

export default useImageModal;
