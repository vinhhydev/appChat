import {Alert, Pressable, StyleSheet, View} from 'react-native';
import {GestureDetector, Gesture} from 'react-native-gesture-handler';
import AppText from '../../components/AppText';
import {TextStoryProp} from '.';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {DIMENSIONS} from '../../constans/dimensions';
import {useEffect, useState} from 'react';
import {COLORS} from '../../constans/colors';
import FastImage from 'react-native-fast-image';

type PropData = {
  item: TextStoryProp;
  index: number;
  setIsTouchView: React.Dispatch<React.SetStateAction<boolean>>;
  positionRemove: {
    x: number;
    y: number;
  };
  toRemove: boolean;
  showModalEdit: boolean;
  indexSelect: number;
  setToRemove: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditText: (
    text: string,
    textColor: string,
    checkBg: boolean,
    alignText: string,
    indexItem: number,
  ) => void;
  handleRemoveText: (index: number) => void;
  indexHover: number;
  setIndexHover: React.Dispatch<React.SetStateAction<number>>;
  lengthList: number;
};

function clamp(val: number, min: number, max: number) {
  return Math.min(Math.max(val, min), max);
}

const RenderText = (props: PropData) => {
  const [zIndex, setZIndex] = useState(props.index);
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const rotation = useSharedValue(0);
  const savedRotation = useSharedValue(0);
  const opacity = useSharedValue(1);
  const [saveValue, setSaveValue] = useState({
    x: translationX.value,
    y: translationY.value,
    scale: scale.value,
    rotation: rotation.value,
    opacity: opacity.value,
  });
  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      {translateX: translationX.value},
      {translateY: translationY.value},
      {scale: scale.value},
      {rotateZ: `${rotation.value}rad`},
    ],
    opacity: opacity.value,
  }));

  useEffect(() => {
    if (!props.showModalEdit) {
      if (props.index === props.indexSelect) {
        scale.value = withTiming(saveValue.scale, {duration: 300});
        rotation.value = withTiming(saveValue.rotation, {duration: 300});
        translationX.value = withTiming(saveValue.x, {duration: 300});
        translationY.value = withTiming(saveValue.y, {duration: 300});
        opacity.value = 1;
      }
    }
  }, [props.showModalEdit]);
  useEffect(() => {
    if (props.indexHover !== props.index) {
      if (zIndex > 0) {
        setZIndex(zIndex - 1);
      }
    }
  }, [props.indexHover]);
  const pan = Gesture.Pan()
    .averageTouches(true)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
      props.setIsTouchView(true);
      props.setIndexHover(props.index);
      setZIndex(props.lengthList);
    })

    .onUpdate(event => {
      const maxTranslateX = DIMENSIONS.width / 2 - 50;
      const maxTranslateY = DIMENSIONS.height / 2 - 50;
      const test = event.x;
      const testY = event.y;
      const fingX = event.absoluteX;
      const fingY = event.absoluteY;
      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX,
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY,
      );
      const x = Math.round(fingX);
      const y = Math.round(fingY) - 45; // 45 height view remove
      const roundX = Math.round(props.positionRemove.x);
      const roundY = Math.round(props.positionRemove.y);
      // console.log('X', x);
      // console.log('y', y);
      // console.log('roundX', roundX);
      // console.log('roundY', roundY);
      if (
        x >= roundX - 45 &&
        x <= roundX + 45 &&
        y >= roundY &&
        y <= roundY + 45
      ) {
        props.setToRemove(true);
      } else {
        props.setToRemove(false);
      }
    })
    .onEnd(() => {
      props.setIsTouchView(false);
      if (props.toRemove) {
        props.handleRemoveText(props.index);
        props.setToRemove(false);
      }
    })
    .runOnJS(true);

  const pressTab = Gesture.Tap()
    .maxDuration(200)
    .onStart(event => {
      if (props.item.type === 'TEXT') {
        //save value before update edit
        setSaveValue({
          x: translationX.value,
          y: translationY.value,
          scale: scale.value,
          rotation: rotation.value,
          opacity: 1,
        });

        scale.value = withTiming(1, {duration: 300});
        rotation.value = withTiming(0, {duration: 300});
        translationX.value = withTiming(0, {duration: 300});
        translationY.value = withTiming(0 - 20, {
          duration: 300,
        });
        opacity.value = withTiming(0, {duration: 500});
        runOnJS(props.handleEditText)(
          props.item.text,
          props.item.color,
          props.item.checkBg,
          props.item.alignText,
          props.index,
        );
      }
    })
    .runOnJS(true);

  const zoomGesture = Gesture.Pinch()
    .onUpdate(event => {
      scale.value = savedScale.value * event.scale;
    })
    .onEnd(() => {
      savedScale.value = scale.value;
    });

  const rotateGesture = Gesture.Rotation()
    .onUpdate(event => {
      rotation.value = savedRotation.value + event.rotation;
    })
    .onEnd(() => {
      savedRotation.value = rotation.value;
    });

  const composed = Gesture.Simultaneous(
    pan,
    pressTab,
    Gesture.Simultaneous(zoomGesture, rotateGesture),
  );
  const alignText =
    props.item.alignText.indexOf('left') > -1
      ? 'left'
      : props.item.alignText.indexOf('center') > -1
      ? 'center'
      : 'right';

  return (
    <GestureDetector gesture={composed}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: '50%',
            transform: [{translateY: -50}],
            alignSelf: 'center',
            backgroundColor:
              props.item.type === 'TEXT'
                ? props.item.checkBg
                  ? props.item.color
                  : 'transparent'
                : 'transparent',
            paddingVertical: 5,
            paddingHorizontal: 8,
            borderRadius: 8,
            zIndex: zIndex,
          },
          animatedStyles,
        ]}>
        {props.item.type === 'TEXT' ? (
          <AppText
            text={props.item.text}
            textSize={25}
            textColor={
              props.item.checkBg
                ? props.item.color === COLORS.WHITE_COLOR
                  ? COLORS.TEXT_BLACK_COLOR
                  : COLORS.WHITE_COLOR
                : props.item.color
            }
            textAlign={alignText}
          />
        ) : (
          <FastImage
            source={props.item.text as any}
            resizeMode="cover"
            style={{width: 100, height: 100}}
          />
        )}
      </Animated.View>
    </GestureDetector>
  );
};

export default RenderText;

const styles = StyleSheet.create({});
