import {useEffect, useRef, useState} from 'react';
import {
  type Image,
  type LayoutChangeEvent,
  type TouchableOpacity,
} from 'react-native';
import type {ModalConfigType} from '../Types';
import {VideoRef} from 'react-native-video';

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
  const [progressTime, setProgressTime] = useState(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    if (!modalConfig.visible) {
      loadCurrentTimeVideo();
    }
  }, [modalConfig.visible]);

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
  };

  const loadCurrentTimeVideo = () => {
    if (progressTime) {
      videoRef.current?.seek(progressTime);
    }
  };

  const handleProgressTime = (type: 'image' | 'video', progress: any) => {
    if (type === 'video') {
      setProgressTime(progress.currentTime);
    }
  };
  const onLayout = (event: LayoutChangeEvent) => {
    // console.log('LAYOUT', event.nativeEvent);
  };
  return {
    modalConfig,
    setModalConfig,
    onPressImage,
    progressTime,
    setProgressTime,
    onLayout,
    imageRef,
    videoRef,
    touchRef,
    loading,
    setLoading,
    error,
    setError,
    handleProgressTime,
    loadCurrentTimeVideo,
  };
};

export default useImagePreview;
