import React, {useEffect, useState} from 'react';
import {Dimensions, Image, TouchableOpacity, View} from 'react-native';
import {images} from '../../assets';
import {ErrorImage, ImageLoader, ImageModal} from './components';
import {useImagePreview} from './hooks';
import styles from './Styles';
import type {ImagePreviewProps} from './Types';
import {IMAGES} from '../../../../constans/images';
import ResizeImage from '../../../ResizeImage';

const ImagePreview = ({
  type,
  imageSource,
  imageStyle,
  renderHeader,
  imageProps,
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
    onLayout,
    setModalConfig,
    imageRef,
    videoRef,
    touchRef,
    loading,
    setLoading,
    error,
    setError,
  } = useImagePreview();

  return (
    <>
      {imageSource && (
        <>
          {modalConfig.visible && (
            <ImageModal
              {...{
                type,
                modalConfig,
                setModalConfig,
                renderHeader,
                imageSource,
                pinchZoomEnabled,
                doubleTapZoomEnabled,
                swipeDownCloseEnabled,
                imageStyle,
              }}
            />
          )}
          <TouchableOpacity
            ref={touchRef}
            onPress={() => onPressImage(type)}
            style={[imageStyle, styles.imageParent]}
            disabled={error}>
            <ResizeImage
              // type={type}
              ref={type === 'image' ? imageRef : videoRef}
              id={type}
              onLayout={onLayout}
              source={imageSource}
              style={imageStyle}
              resizeMode="contain"
              onLoadStart={() => {
                setLoading(true);
                setError(false);
              }}
              onLoadEnd={() => {
                setLoading(false);
              }}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
              {...imageProps}
            />
            {error && <ErrorImage {...{imageStyle, errorImageSource}} />}
            {loading && (
              <ImageLoader {...{renderImageLoader}} {...imageLoaderProps} />
            )}
          </TouchableOpacity>
        </>
      )}
    </>
  );
};

export default ImagePreview;
