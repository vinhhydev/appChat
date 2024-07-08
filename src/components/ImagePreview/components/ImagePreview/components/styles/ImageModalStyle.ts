import {Platform, StyleSheet} from 'react-native';

const styles = (x: number, y: number, height: number, width: number) =>
  StyleSheet.create({
    modalContainer: {
      paddingTop: Platform.OS === 'ios' ? 60 : 0,
      flex: 1,
    },
    gestureContainer: {
      flex: 1,
    },
    imageStyle: {
      position: 'absolute',
      top: y,
      left: x,
      height,
      width,
    },
    activityIndicatorStyle: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
    },
  });

export default styles;
