import {TouchableOpacity} from 'react-native';
import {images} from '../../assets';
import {ErrorImage, ImageLoader, ImageModal} from './components';
import {useImagePreview} from './hooks';
import styles from './Styles';
import type {ImagePreviewProps} from './Types';
import ResizeImage from '../../../ResizeImage';

const ImagePreview = ({
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
    onLayout,
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
                progressTime,
                setProgressTime,
                loadCurrentTimeVideo,
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
              onProgress={(progress: any) => handleProgressTime(type, progress)}
              onLayout={onLayout}
              source={imageSource}
              paused={true}
              style={imageStyle}
              resizeMode="contain"
              onLoad={() => {
                setLoading(false);
              }}
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
