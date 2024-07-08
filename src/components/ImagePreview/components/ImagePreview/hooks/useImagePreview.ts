import {useRef, useState} from 'react';
import {
  UIManager,
  findNodeHandle,
  type Image,
  type LayoutChangeEvent,
  type TouchableOpacity,
} from 'react-native';
import type {ModalConfigType} from '../Types';
import Video, {VideoRef} from 'react-native-video';
import {measure, useAnimatedRef} from 'react-native-reanimated';

const useImagePreview = () => {
  const [modalConfig, setModalConfig] = useState<ModalConfigType>({
    x: 0,
    y: 0,
    height: 0,
    width: 0,
    visible: false,
  });
  const imageRef = useRef<Image>(null);
  const videoRef = useRef<VideoRef>(null);
  const touchRef = useRef<TouchableOpacity>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  /**
   * Use to get the position and size of image and set to modalConfig
   */
  const onPressImage = async (type: 'image' | 'video') => {
    touchRef.current?.measure((_ox, _oy, width, height, px, py) => {
      setModalConfig({
        x: px,
        y: py - 60,
        width: width,
        height: height,
        visible: true,
      });
    });
    // imageRef.current?.measure((_ox, _oy, width, height, px, py) => {
    //   setModalConfig({
    //     x: px,
    //     y: py - 60,
    //     width: width,
    //     height: height,
    //     visible: true,
    //   });
    // });
  };
  const onLayout = (event: LayoutChangeEvent) => {
    // console.log('LAYOUT', event.nativeEvent);
  };
  return {
    modalConfig,
    setModalConfig,
    onPressImage,
    onLayout,
    imageRef,
    videoRef,
    touchRef,
    loading,
    setLoading,
    error,
    setError,
  };
};

export default useImagePreview;
