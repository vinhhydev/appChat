import type {Dispatch, SetStateAction} from 'react';
import type {
  ActivityIndicatorProps,
  ImageProps,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
} from 'react-native';

export type ModalConfigType = {
  x: number;
  y: number;
  height: number;
  width: number;
  visible: boolean;
};

export type HeaderOpacityAnimationType = {
  opacity: number;
};

export type ImagePreviewProps = {
  type: 'image' | 'video';
  imageSource: ImageSourcePropType;
  imageStyle: StyleProp<ImageStyle>;
  doubleTapZoomEnabled?: boolean;
  pinchZoomEnabled?: boolean;
  swipeDownCloseEnabled?: boolean;
  errorImageSource?: ImageSourcePropType;
  renderHeader?: (close: () => void) => React.ReactElement;
  imageLoaderProps?: ActivityIndicatorProps;
} & Pick<ImageLoaderProps, 'renderImageLoader'>;

export type ImageModalProps = Omit<
  ImagePreviewProps,
  'imageStyle' | 'imageProps' | 'errorImageSource'
> & {
  setModalConfig: Dispatch<SetStateAction<ModalConfigType>>;
  modalConfig: ModalConfigType;
  imageStyle: StyleProp<ImageStyle>;
  progressTime: number;
  setProgressTime: React.Dispatch<React.SetStateAction<number>>;
  loadCurrentTimeVideo: (type: 'image' | 'video') => void;
};

export type HeaderProps = Pick<ImagePreviewProps, 'renderHeader'> & {
  onPressClose: () => void;
  headerOpacityAnimation: HeaderOpacityAnimationType;
};

export type ErrorImageProps = Required<
  Pick<ImagePreviewProps, 'imageStyle' | 'errorImageSource'>
>;
export type UseImageModalProps = {
  modalConfig: ModalConfigType;
  setModalConfig: Dispatch<SetStateAction<ModalConfigType>>;
  pinchZoomEnabled: boolean | undefined;
  doubleTapZoomEnabled: boolean | undefined;
  swipeDownCloseEnabled: boolean | undefined;
};

export type ImageLoaderProps = ActivityIndicatorProps & {
  renderImageLoader?: () => React.ReactElement;
};
