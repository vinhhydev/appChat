import {
  FlatList,
  GestureResponderEvent,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {COLORS} from '../../constans/colors';
import AppText from '../../components/AppText';
import {DIMENSIONS} from '../../constans/dimensions';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconV2 from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {useNavigation} from '@react-navigation/native';
import {useCallback, useMemo, useRef, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Svg, Path} from 'react-native-svg';
import ViewShot, {captureRef} from 'react-native-view-shot';
import {Slider, RangeSlider} from '@react-native-assets/slider';
import RenderText from './RenderText';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {FFmpegKit, ReturnCode, FFmpegKitConfig} from 'ffmpeg-kit-react-native';
import RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import {useAuth} from '../../context/AuthContext';
import {IMAGES} from '../../constans/images';
import FastImage from 'react-native-fast-image';
import DeviceInfo from 'react-native-device-info';
import Video, {OnLoadData, OnProgressData, VideoRef} from 'react-native-video';
import {Helpers} from '../../common';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export type TextStoryProp = {
  text: string;
  color: string;
  checkBg: boolean;
  alignText: string;
  position: string;
  type: 'TEXT' | 'STICKER';
};

export type PathProp = {
  d: string[];
  color: string;
  width: number;
};

const LIST_BG_EDIT = [
  COLORS.LINEAR_PUPER_COLOR,
  COLORS.LINEAR_PINK_COLOR,
  COLORS.LINEAR_BLUE_COLOR,
  COLORS.LINEAR_GREEN_COLOR,
  COLORS.LINEAR_BLACK_COLOR,
];
const LIST_ALIGN_TEXT = [
  'format-align-left',
  'format-align-center',
  'format-align-right',
];

const numColumns = 3;
const gap = 60;
const availableSpace = DIMENSIONS.width - 40 - (numColumns - 1) * gap;
const itemSize = availableSpace / numColumns;

// check phone have bunny ear
const checkNotch = DeviceInfo.hasNotch();
// only android
const statusBarHeight = StatusBar.currentHeight ?? 0;

const heightScreen = checkNotch
  ? Platform.OS === 'android'
    ? DIMENSIONS.height - statusBarHeight
    : DIMENSIONS.height - 60
  : DIMENSIONS.height;

const bodyScreen = heightScreen * 0.88;
const bottomScreen = heightScreen - bodyScreen;

const EditDetailStoryScreen = ({route}: any) => {
  const navigation = useNavigation();
  const background = route?.params?.background;
  const filename = route?.params?.filename;
  const type = route?.params?.type;
  const duration = route?.params?.duration;
  const viewShot = useRef<ViewShot>(null);
  const videoRef = useRef<VideoRef>(null);
  const [showDrawView, setShowDrawView] = useState(false);
  const [indexBG, setIndexBG] = useState(0);
  const [showModalEdit, setShowModalEdit] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [indexSelect, setIndexSelect] = useState(-1);
  const [indexHover, setIndexHover] = useState(-1);
  const [indexAlign, setIndexAlign] = useState(1);
  const [indexColor, setIndexColor] = useState(0);
  const [textStory, setTextStory] = useState('');
  const [textBG, setTextBG] = useState(false);
  const [listTextStory, setListTextStory] = useState<TextStoryProp[]>([]);
  const [isTouchView, setIsTouchView] = useState(false);
  const [positionRemove, setPositionRemove] = useState({x: 0, y: 0});
  const [toRemove, setToRemove] = useState(false);
  const [isEraser, setIsEraser] = useState(false);
  const [listPath, setListPath] = useState<PathProp[]>([
    {d: [''], color: COLORS.WHITE_COLOR, width: 0},
  ]);
  const [path, setPath] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [widthLine, setWidthLine] = useState(5);
  const [touchSlider, setTouchSlider] = useState(false);
  const [isDraw, setIsDraw] = useState(false);
  const [showSheet, setShowSheet] = useState(false);
  const [frames, setFrames] = useState<string[]>([]);
  const {bottomSheetModalRef, handleSheetChanges, handlePresentModalPress} =
    useAuth();
  const [showTimeLine, setShowTimeLine] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [durationBG, setDurationBG] = useState(duration ? duration : 0);
  const valueTimeline = useSharedValue(0);

  const animatedSlideTime = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: valueTimeline.value,
      },
    ],
  }));

  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.3}
        pressBehavior={'close'}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );

  const onTouchEnd = () => {
    setIsDraw(false);
    path.push(...currentPath);
    const newPath: PathProp = {
      d: currentPath,
      color: isEraser ? 'transparent' : COLORS.LIST_TEXT_COLOR[indexColor],
      width: widthLine,
    };
    setListPath([...listPath, newPath]);

    setCurrentPath([]);
  };

  const onTouchMove = (event: GestureResponderEvent) => {
    const newPath = [...currentPath];
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(
      0,
    )},${locationY.toFixed(0)} `;
    newPath.push(newPoint);
    setCurrentPath(newPath);
  };
  const onTouchStart = (event: GestureResponderEvent) => {
    setIsDraw(true);
    const newPath = [...currentPath];
    const locationX = event.nativeEvent.locationX;
    const locationY = event.nativeEvent.locationY;
    const newPoint = `${newPath.length === 0 ? 'M' : ''}${locationX.toFixed(
      0,
    )},${locationY.toFixed(0)},${locationX.toFixed(0)},${locationY.toFixed(0)}`;
    path.push(newPoint);
    const startPath: PathProp = {
      d: [newPoint],
      color: isEraser ? 'transparent' : COLORS.LIST_TEXT_COLOR[indexColor],
      width: widthLine,
    };
    listPath.push(startPath);
    // setListPath([...listPath, startPath]);
  };
  const undoLastDraw = () => {
    const newList = listPath.splice(0, listPath.length - 2);
    setListPath(newList);
  };
  const initText = () => {
    setTextStory('');
    setIndexAlign(1);
    setIndexColor(0);
    setTextBG(false);
  };
  const handleChangeBackground = () => {
    if (indexBG < LIST_BG_EDIT.length - 1) {
      setIndexBG(indexBG + 1);
    } else {
      setIndexBG(0);
    }
  };
  const handleChangeAlgin = () => {
    if (indexAlign < LIST_ALIGN_TEXT.length - 1) {
      setIndexAlign(indexAlign + 1);
    } else {
      setIndexAlign(0);
    }
  };
  const handleChangeColor = (index: number) => {
    setIndexColor(index);
    setIsEraser(false);
  };

  const handleAddTextToList = () => {
    if (textStory.length > 0) {
      const temp: TextStoryProp = {
        text: textStory,
        color: COLORS.LIST_TEXT_COLOR[indexColor],
        alignText: LIST_ALIGN_TEXT[indexAlign],
        checkBg: textBG,
        position: '',
        type: 'TEXT',
      };
      setListTextStory(old => [...old, temp]);
    }
  };
  const handleAddSticker = (itemSticker: string) => {
    const temp: TextStoryProp = {
      text: itemSticker,
      color: '',
      alignText: '',
      checkBg: false,
      position: '',
      type: 'STICKER',
    };
    setListTextStory(old => [...old, temp]);
    bottomSheetModalRef.current?.dismiss();
  };
  const handleRemoveText = (index: number) => {
    const newList = listTextStory.filter((_, _index) => index !== _index);
    setListTextStory(newList);
  };
  const handleEditText = (
    text: string,
    textColor: string,
    checkBg: boolean,
    alignText: string,
    indexItem: number,
  ) => {
    setIndexSelect(indexItem);
    setEditMode(true);
    setShowModalEdit(true);
    setTextStory(text);
    setIndexColor(COLORS.LIST_TEXT_COLOR.indexOf(textColor));
    setTextBG(checkBg);
    setIndexAlign(LIST_ALIGN_TEXT.indexOf(alignText));
  };
  const handleUpdateList = () => {
    const newText: TextStoryProp = {
      text: textStory,
      color: COLORS.LIST_TEXT_COLOR[indexColor],
      alignText: LIST_ALIGN_TEXT[indexAlign],
      checkBg: textBG,
      position: '',
      type: 'TEXT',
    };
    const newList = listTextStory.map((val, index) => {
      if (index === indexSelect) {
        return newText;
      } else {
        return val;
      }
    }) as TextStoryProp[];
    setListTextStory(newList);
  };
  const handleUploadStory = () => {
    captureRef(viewShot, {
      format: 'png',
      quality: 0.8,
    }).then(uri => {
      const backgroundStory = {
        background,
        type,
      };
      // console.log('URI CAPTURE', uri);
      // setUriCapture(uri);
      navigation.navigate({
        name: 'StoryScreen',
        params: {
          uriCapture: uri,
          backgroundStory,
        },
      } as never);
    });
  };

  const handleEditVideo = () => {
    setShowTimeLine(true);
  };

  const handleVideoLoad = async (e: OnLoadData) => {
    setDurationBG(e.duration);
    setEndTime(e.duration);
    console.log('BACKGROUND', background, type, filename, duration);

    const destinationPath = `${RNFS.CachesDirectoryPath}/${filename?.replace(
      '.mp4',
      '',
    )}`;
    let uriVideo = '';
    if (await RNFS.exists(destinationPath)) {
      uriVideo = destinationPath;
    } else {
      if (Platform.OS === 'ios') {
        uriVideo = `file://${await RNFS.copyAssetsVideoIOS(
          background,
          destinationPath,
        )}`;
      } else {
        // await RNFS.copyFileAssets(background, destinationPath).then(value => {
        //   console.log('VALUE', value);
        //   uriVideo = destinationPath;
        // });
        if (background.startsWith('content://')) {
          const realPath = await RNFetchBlob.fs.stat(background);
          uriVideo = realPath.path;
        } else {
          uriVideo = background;
        }
      }
    }

    const outputImagePath = `${destinationPath}_%4d.png`;
    const videoDuration = Math.ceil(e.duration);
    const frameNumber = 10; // default 10 frame per second
    const FRAME_PER_SEC = videoDuration / frameNumber;
    const FRAME_PER = FRAME_PER_SEC < 1 ? FRAME_PER_SEC * 10 : FRAME_PER_SEC;
    if (
      await RNFS.exists(
        outputImagePath.replace('%4d.png', `${String(1).padStart(4, '0')}.png`),
      )
    ) {
      const _frames = [];
      for (let i = 0; i < frameNumber; i++) {
        _frames.push(
          `${outputImagePath.replace(
            '%4d.png',
            `${String(i + 1).padStart(4, '0')}.png`,
          )}`,
        );
      }
      setFrames(_frames);
    } else {
      const ffmpegCommand = `-ss 0 -i ${uriVideo} -vf "fps=${FRAME_PER}/1:round=up,scale=80:-2" -vframes ${frameNumber} ${outputImagePath}`;

      FFmpegKit.executeAsync(ffmpegCommand, async session => {
        const state = FFmpegKitConfig.sessionStateToString(
          await session.getState(),
        );
        const returnCode = await session.getReturnCode();
        const failStackTrace = await session.getFailStackTrace();
        const duration = await session.getDuration();

        if (ReturnCode.isSuccess(returnCode)) {
          console.log(
            `Encode completed successfully in ${duration} milliseconds;`,
          );
          console.log(`Check at ${outputImagePath}`);
          const _frames = [];
          for (let i = 0; i < frameNumber; i++) {
            _frames.push(
              `${outputImagePath.replace(
                '%4d.png',
                `${String(i + 1).padStart(4, '0')}.png`,
              )}`,
            );
          }

          setFrames(_frames);
        } else if (ReturnCode.isCancel(returnCode)) {
          console.log('Encode canceled');
        } else {
          console.log(
            `Encode failed with state ${state} and rc ${returnCode}.${failStackTrace}`,
          );
        }
      });
    }
  };

  const handleOnProgessVideo = (e: OnProgressData) => {
    const durationVideo = !Helpers.isNullOrUndefined(duration)
      ? duration
      : durationBG;
    const widthLine = DIMENSIONS.width - 45;
    const positionVideo = (e.currentTime * widthLine) / durationVideo;
    const startPositon = (startTime * widthLine) / durationVideo;
    // console.log(
    //   'PROGESS',
    //   e.currentTime,
    //   durationVideo,
    //   startPositon,
    //   positionVideo,
    //   valueTimeline.value,
    //   widthLine,
    //   startTime,
    // );
    if (e.currentTime >= endTime || e.currentTime >= durationVideo) {
      valueTimeline.value = startPositon;
      videoRef.current?.seek(startTime);
    } else {
      if (e.currentTime >= startTime) {
        valueTimeline.value = withTiming(positionVideo, {}, call => {
          // runOnJS(resetTime)(e, startPositon, durationVideo);
        });
      }
    }
  };

  // const resetTime = (
  //   e: OnProgressData,
  //   startPositon: number,
  //   durationVideo: number,
  // ) => {
  //   if (e.currentTime >= endTime || e.currentTime >= durationVideo) {
  //     valueTimeline.value = startPositon;
  //     videoRef.current?.seek(startTime);
  //   }
  // };

  //view list color
  const listColor = useMemo(() => {
    return (
      <FlatList
        data={COLORS.LIST_TEXT_COLOR}
        keyExtractor={(_, index) => `color-${index}`}
        horizontal
        contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }}
        keyboardShouldPersistTaps={'always'}
        renderItem={({item, index}) => {
          return (
            <Pressable
              style={{
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50,
                borderWidth: index === indexColor && !isEraser ? 25 : 0,
                borderColor: COLORS.WHITE_COLOR,
                marginHorizontal: 7,
              }}
              onPress={() => handleChangeColor(index)}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor:
                    index === indexColor && !isEraser
                      ? COLORS.TEXT_BLACK_COLOR
                      : COLORS.LIGHT_GRAY,
                  backgroundColor: item,
                }}
              />
            </Pressable>
          );
        }}
      />
    );
  }, [indexColor]);

  //show modal edit text story
  const modalEdit = useMemo(() => {
    return (
      <KeyboardAvoidingView
        behavior="height"
        keyboardVerticalOffset={
          Platform.OS === 'android'
            ? StatusBar.currentHeight
            : checkNotch
            ? 60
            : 20
        }
        style={styles.containerModal}>
        <View>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss();
              initText();
              setShowModalEdit(false);
              if (editMode) {
                handleUpdateList();
              } else {
                setIndexSelect(-1);
                handleAddTextToList();
              }
            }}>
            <View style={styles.contentModal}>
              <TouchableOpacity
                style={{position: 'absolute', top: 15, right: 15}}
                onPress={() => {
                  initText();
                  setShowModalEdit(false);
                  if (editMode) {
                    handleUpdateList();
                  } else {
                    setIndexSelect(-1);
                    handleAddTextToList();
                  }
                }}>
                <AppText
                  text="Xong"
                  textColor={COLORS.WHITE_COLOR}
                  textSize={18}
                />
              </TouchableOpacity>

              <TextInput
                style={[
                  styles.txtInputEdit,
                  indexAlign === 0
                    ? styles.alignLeft
                    : indexAlign === 1
                    ? styles.alignCenter
                    : styles.alignRight,
                  {
                    color: textBG
                      ? indexColor === 0
                        ? COLORS.TEXT_BLACK_COLOR
                        : COLORS.WHITE_COLOR
                      : COLORS.LIST_TEXT_COLOR[indexColor],
                    backgroundColor: textBG
                      ? COLORS.LIST_TEXT_COLOR[indexColor]
                      : 'transparent',
                  },
                ]}
                onChangeText={val => setTextStory(val)}
                value={textStory}
                selectionColor={COLORS.LIST_TEXT_COLOR[indexColor]}
                multiline
                autoFocus={showModalEdit}
              />
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.viewChooseColor}>
            <Pressable
              style={styles.touchAlignText}
              onPress={handleChangeAlgin}>
              <Icon
                name={LIST_ALIGN_TEXT[indexAlign]}
                size={30}
                color={COLORS.WHITE_COLOR}
              />
            </Pressable>
            {listColor}
            <Pressable
              style={styles.touchBackgroundText}
              onPress={() => setTextBG(!textBG)}>
              {textBG ? (
                <Icon
                  name="font-download"
                  size={30}
                  color={COLORS.WHITE_COLOR}
                />
              ) : (
                <View
                  style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',

                    borderWidth: 2,
                    borderColor: COLORS.WHITE_COLOR,
                    borderRadius: 5,
                  }}>
                  <AppText
                    text="A"
                    textColor={COLORS.WHITE_COLOR}
                    textSize={20}
                    style={{fontWeight: 600}}
                  />
                </View>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }, [showModalEdit, indexAlign, textStory, indexColor, textBG]);

  //load list text story
  const loadTextMap = useMemo(() => {
    return listTextStory.map((item, index) => {
      return (
        <RenderText
          item={item}
          index={index}
          key={`text-${index}`}
          setIsTouchView={setIsTouchView}
          positionRemove={positionRemove}
          handleRemoveText={handleRemoveText}
          toRemove={toRemove}
          showModalEdit={showModalEdit}
          indexSelect={indexSelect}
          setToRemove={setToRemove}
          handleEditText={handleEditText}
          indexHover={indexHover}
          setIndexHover={setIndexHover}
          lengthList={listTextStory.length}
        />
      );
    });
  }, [listTextStory, toRemove, showModalEdit, indexSelect, indexHover]);

  //show draw view
  const loadDrawMap = () => {
    return (
      <View style={styles.containerDraw}>
        {!isDraw && (
          <>
            <TouchableOpacity
              style={{position: 'absolute', top: 25, right: 15}}
              onPress={() => {
                setShowDrawView(false);
              }}>
              <AppText
                text="Xong"
                textColor={COLORS.WHITE_COLOR}
                textSize={18}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{position: 'absolute', top: 25, left: 15}}
              onPress={() => {
                undoLastDraw();
              }}>
              <AppText
                text="Hoàn tác"
                textColor={COLORS.WHITE_COLOR}
                textSize={18}
              />
            </TouchableOpacity>
          </>
        )}
        {!isDraw && (
          <View
            style={{
              position: 'absolute',
              top: '50%',
              left: 10,
              transform: [{translateY: -80}],
              padding: 5,
              paddingVertical: 30,
            }}>
            <Slider
              style={{
                width: 30,
                height: 160,
              }}
              onTouchStart={() => {
                setTouchSlider(true);
              }}
              onTouchEnd={() => {
                setTouchSlider(false);
              }}
              trackHeight={10}
              thumbSize={25}
              minimumValue={5}
              maximumValue={20}
              onValueChange={val => setWidthLine(val)}
              minimumTrackTintColor={COLORS.PLACEHOLDER_TEXT_INPUT_COLOR}
              maximumTrackTintColor={COLORS.PLACEHOLDER_TEXT_INPUT_COLOR}
              thumbTintColor={COLORS.WHITE_COLOR}
              vertical={true}
              inverted
            />
          </View>
        )}
        {touchSlider && (
          <View
            style={{
              width: widthLine,
              height: widthLine,
              borderWidth: 0.5,
              borderRadius: 50,
              borderColor: COLORS.WHITE_COLOR,
              position: 'absolute',
              transform: [
                {
                  translateY: -widthLine / 2,
                },
              ],
              top: '50%',
            }}
          />
        )}
        <View
          style={styles.contentDraw}
          onTouchEnd={onTouchEnd}
          onTouchMove={onTouchMove}
          onTouchStart={onTouchStart}>
          <Svg>
            {path.map((_, _index) => {
              return (
                <Path
                  key={`path-${_index}`}
                  d={currentPath.join('')}
                  stroke={
                    isEraser
                      ? 'transparent'
                      : COLORS.LIST_TEXT_COLOR[indexColor]
                  }
                  mask=""
                  fill={'transparent'}
                  strokeWidth={widthLine}
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              );
            })}
          </Svg>
        </View>
      </View>
    );
  };

  //show bottom sheet sticker
  const sheetSticker = useMemo(() => {
    return (
      <BottomSheetModalProvider>
        <BottomSheetModal
          style={{backgroundColor: 'transparent'}}
          handleStyle={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
          handleIndicatorStyle={{backgroundColor: COLORS.LIGHT_GRAY}}
          backgroundStyle={{backgroundColor: 'rgba(0,0,0,0.1)'}}
          ref={bottomSheetModalRef}
          index={1}
          snapPoints={['90%', '90%']}
          onChange={index => {
            handleSheetChanges(index);
            setShowSheet(index === 1);
          }}
          backdropComponent={renderBackdrop}>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              paddingHorizontal: 20,
            }}>
            <FlatList
              data={IMAGES.LIST_STICKER}
              keyExtractor={(_, index) => `sticker-${index}`}
              numColumns={numColumns}
              columnWrapperStyle={{gap}}
              contentContainerStyle={{gap, paddingTop: 20, paddingBottom: 30}}
              showsVerticalScrollIndicator={false}
              renderItem={({item}) => {
                return (
                  <Pressable onPress={() => handleAddSticker(item)}>
                    <FastImage
                      source={item}
                      resizeMode="cover"
                      style={{
                        width: itemSize,
                        height: itemSize,
                      }}
                    />
                  </Pressable>
                );
              }}
            />
          </View>
        </BottomSheetModal>
      </BottomSheetModalProvider>
    );
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: COLORS.PRIMARY_COLOR}}>
      <StatusBar
        backgroundColor={COLORS.PRIMARY_COLOR}
        barStyle={'light-content'}
      />
      <GestureHandlerRootView
        style={[{backgroundColor: COLORS.TEXT_BLACK_COLOR}]}>
        <View style={styles.contentEdit}>
          {!showDrawView && !showModalEdit && !isTouchView && !showSheet && (
            <View style={styles.headerEdit}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon
                  name="chevron-left"
                  size={30}
                  color={COLORS.WHITE_COLOR}
                />
              </TouchableOpacity>
              <View style={styles.editTools}>
                <TouchableOpacity onPress={() => setShowDrawView(true)}>
                  <Icon name="draw" size={30} color={COLORS.WHITE_COLOR} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{marginHorizontal: 35}}
                  onPress={() => {
                    initText();
                    setShowModalEdit(true);
                    setEditMode(false);
                  }}>
                  <AppText
                    text="Aa"
                    textColor={COLORS.WHITE_COLOR}
                    textSize={25}
                    style={{fontWeight: 700}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    handlePresentModalPress();
                  }}>
                  <IconV2
                    name="sticker-emoji"
                    size={30}
                    color={COLORS.WHITE_COLOR}
                  />
                </TouchableOpacity>
                {!Helpers.isNullOrUndefined(type) && type === 'video' && (
                  <TouchableOpacity
                    onPress={() => {
                      setShowTimeLine(true);
                    }}
                    style={{marginLeft: 30}}>
                    <IconV2
                      name="content-cut"
                      size={30}
                      color={COLORS.WHITE_COLOR}
                    />
                  </TouchableOpacity>
                )}
              </View>
              {Helpers.isNullOrUndefined(background) ? (
                <TouchableOpacity onPress={handleChangeBackground}>
                  <LinearGradient
                    start={{x: 0, y: 0.1}}
                    end={{x: 0.7, y: 0.4}}
                    colors={LIST_BG_EDIT[indexBG]}
                    style={styles.touchChangeColor}></LinearGradient>
                </TouchableOpacity>
              ) : (
                <View />
              )}
            </View>
          )}
          <ViewShot style={styles.viewShot} ref={viewShot}>
            <LinearGradient
              start={{x: 0, y: 0.1}}
              end={{x: 0.7, y: 0.3}}
              colors={
                background
                  ? ['transparent', 'transparent']
                  : LIST_BG_EDIT[indexBG]
              }
              style={[
                styles.containerBackground,
                {backgroundColor: 'transparent'},
              ]}>
              <>
                {!showSheet && (
                  <View style={styles.bodyEdit}>
                    <Pressable
                      style={styles.touchInput}
                      onPress={() => {
                        initText();
                        setShowModalEdit(true);
                        setEditMode(false);
                      }}>
                      {!showDrawView && !showModalEdit && (
                        <AppText
                          text={
                            listTextStory.length === 0 &&
                            Helpers.isNullOrUndefined(background)
                              ? 'Nhấn để nhập...'
                              : ''
                          }
                          textColor={COLORS.INPUT_STORY_GRAY}
                          textFont="bold"
                          textSize={25}
                        />
                      )}
                    </Pressable>
                  </View>
                )}
                {loadTextMap}
                <View
                  style={[
                    styles.viewRemove,
                    toRemove && {backgroundColor: COLORS.WHITE_COLOR},
                    {opacity: isTouchView ? 1 : 0},
                  ]}
                  onLayout={e => {
                    setPositionRemove({
                      x: e.nativeEvent.layout.x,
                      y: e.nativeEvent.layout.y,
                    });
                  }}>
                  <Icon
                    name="delete"
                    size={25}
                    color={
                      toRemove ? COLORS.TEXT_BLACK_COLOR : COLORS.WHITE_COLOR
                    }
                  />
                </View>
                <View style={styles.contentDraw}>
                  <Svg>
                    {listPath.map((item, index) => {
                      return (
                        <Path
                          key={`pathList-${index}`}
                          d={item.d.join('')}
                          stroke={item.color}
                          fill={'transparent'}
                          strokeWidth={item.width}
                          strokeLinejoin="round"
                          strokeLinecap="round"
                        />
                      );
                    })}
                  </Svg>
                </View>
              </>
            </LinearGradient>
          </ViewShot>
          {/* {background}        */}
          {type === 'video' ? (
            <>
              <LinearGradient
                start={{x: 0, y: 0.1}}
                end={{x: 0, y: 0.3}}
                colors={[
                  'rgba(0,0,0,0.14)',
                  'rgba(0,0,0,0.03)',
                  'transparent',
                  'transparent',
                ]}
                style={[styles.containerBackground, {zIndex: -1}]}
              />
              <View
                style={[
                  styles.containerBackground,
                  {backgroundColor: COLORS.BG_EDIT_STORY_COLOR},
                ]}>
                <Video
                  ref={videoRef}
                  style={{width: '100%', height: '100%'}}
                  source={{uri: background}}
                  resizeMode="contain"
                  onLoad={handleVideoLoad}
                  onProgress={handleOnProgessVideo}
                />
              </View>
            </>
          ) : (
            <ImageBackground
              style={styles.containerBackground}
              source={{uri: background}}
              resizeMode="contain"
            />
          )}
          <View
            style={[styles.bottomTool, showTimeLine && {paddingHorizontal: 0}]}>
            {!isTouchView && !showDrawView && !showSheet && !showTimeLine && (
              <>
                <TouchableOpacity style={{alignItems: 'center'}}>
                  <Icon
                    name="settings"
                    size={DIMENSIONS.hp(3)}
                    color={COLORS.WHITE_COLOR}
                  />
                  <AppText
                    text="Quyền riêng tư"
                    textColor={COLORS.WHITE_COLOR}
                    style={{marginTop: 5}}
                    textFont="bold"
                    textSize={DIMENSIONS.wp(4)}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.btnAdd}
                  onPress={handleUploadStory}>
                  <AppText
                    text="Thêm vào tin"
                    textColor={COLORS.WHITE_COLOR}
                    style={{marginRight: 5}}
                    textFont="bold"
                  />
                  <Icon
                    name="add-circle"
                    color={COLORS.WHITE_COLOR}
                    size={25}
                  />
                </TouchableOpacity>
              </>
            )}
            {showDrawView && !isDraw && (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Pressable
                  style={{
                    padding: 10,
                    borderRadius: 30,
                    backgroundColor: isEraser
                      ? COLORS.WHITE_COLOR
                      : 'transparent',
                  }}
                  onPress={() => setIsEraser(!isEraser)}>
                  <Icon
                    name="auto-fix-high"
                    size={30}
                    color={
                      isEraser ? COLORS.TEXT_BLACK_COLOR : COLORS.WHITE_COLOR
                    }
                  />
                </Pressable>
                {listColor}
              </View>
            )}
            {showTimeLine && frames?.length > 0 && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                  width: DIMENSIONS.width,
                  paddingHorizontal: 30,
                }}>
                <View
                  style={{
                    position: 'absolute',
                    top: 0,

                    zIndex: 999,
                    width: DIMENSIONS.width - 45,
                    alignSelf: 'center',
                  }}>
                  <Animated.View
                    style={[
                      animatedSlideTime,
                      {
                        position: 'absolute',
                        top: 0,
                        borderRadius: 8,
                        zIndex: 99,
                        backgroundColor: COLORS.ERROR_COLOR,
                        height: bottomScreen - 50,
                        width: 5,
                      },
                    ]}
                  />
                  <RangeSlider
                    range={[0, durationBG]}
                    minimumValue={0}
                    maximumValue={durationBG}
                    minimumRange={1}
                    outboundColor="rgba(0,0,0,0.5)"
                    inboundColor="transparent"
                    thumbTintColor={COLORS.WHITE_COLOR}
                    thumbStyle={{height: bottomScreen - 50, width: 10}}
                    thumbSize={40}
                    style={{
                      width: '100%',
                      height: bottomScreen - 50,
                    }}
                    trackStyle={{
                      width: '100%',
                      height: bottomScreen - 50,
                      borderWidth: 2,
                      borderColor: COLORS.WHITE_COLOR,
                    }}
                    onValueChange={value => {
                      console.log('CHANGE', value);
                      setStartTime(value[0]);
                      setEndTime(value[1]);
                    }}
                    onTouchStart={() => {
                      videoRef.current?.pause();
                    }}
                    onTouchEnd={() => {
                      videoRef.current?.resume();
                    }}
                  />
                </View>

                {frames &&
                  frames?.map((val, index) => {
                    return (
                      <FastImage
                        key={`previewVideo-${index}`}
                        source={{uri: 'file://' + val}}
                        resizeMode="cover"
                        style={{
                          width: (DIMENSIONS.width - 60) / frames.length,
                          height: bottomScreen - 50,
                          // aspectRatio:
                          //   (DIMENSIONS.width - 30) / 10 / (bottomScreen - 50),
                        }}
                      />
                    );
                  })}
              </View>
            )}
          </View>
          {showDrawView && loadDrawMap()}
          {showModalEdit && modalEdit}
          {sheetSticker}
        </View>
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default EditDetailStoryScreen;

const styles = StyleSheet.create({
  contentEdit: {
    width: DIMENSIONS.width,
    height: heightScreen,
    position: 'relative',
    backgroundColor: COLORS.TEXT_BLACK_COLOR,
  },
  viewShot: {
    width: DIMENSIONS.width,
    height: bodyScreen,
    backgroundColor: 'transparent',
  },
  containerBackground: {
    width: DIMENSIONS.width,
    height: bodyScreen,
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    zIndex: -99,
    overflow: 'hidden',
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
  },
  headerEdit: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 20,
    left: 15,
    right: 15,
    zIndex: 99,
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.29,
    // shadowRadius: 4.65,
    // elevation: 7,
  },
  editTools: {
    flexDirection: 'row',
  },
  touchChangeColor: {
    width: 30,
    height: 30,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.WHITE_COLOR,
  },
  bodyEdit: {
    flex: 1,
    zIndex: 1,
  },
  touchInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTool: {
    width: DIMENSIONS.width,
    height: bottomScreen - 10,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  btnAdd: {
    flexDirection: 'row',
    backgroundColor: COLORS.ADD_STORY_COLOR,
    paddingHorizontal: 10,
    paddingVertical: 10,
    alignSelf: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  containerModal: {
    width: DIMENSIONS.width,
    height: bodyScreen,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 100,
  },
  contentModal: {
    width: DIMENSIONS.width,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingHorizontal: 40,
  },
  txtInputEdit: {
    fontSize: 25,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  alignLeft: {
    alignSelf: 'flex-start',
    textAlign: 'left',
  },
  alignCenter: {
    textAlign: 'center',
    alignSelf: 'center',
  },
  alignRight: {
    textAlign: 'right',
    alignSelf: 'flex-end',
  },
  viewChooseColor: {
    width: DIMENSIONS.width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  touchAlignText: {
    paddingHorizontal: 15,
  },
  touchBackgroundText: {
    paddingHorizontal: 15,
    alignSelf: 'center',
  },
  viewRemove: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
    alignSelf: 'center',
    zIndex: 999,
  },
  containerDraw: {
    width: DIMENSIONS.width,
    height: DIMENSIONS.height * 0.9 - 60,
    position: 'absolute',
    alignItems: 'center',
    zIndex: 100,
  },
  contentDraw: {
    width: DIMENSIONS.width,
    height: DIMENSIONS.height * 0.9 - 60,
    position: 'absolute',
    alignItems: 'center',
    zIndex: -1,
  },
});
