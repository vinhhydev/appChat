import {
  FlatList,
  GestureResponderEvent,
  Keyboard,
  KeyboardAvoidingView,
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
import {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Svg, Path} from 'react-native-svg';
import ViewShot, {captureRef} from 'react-native-view-shot';
import {Slider} from '@react-native-assets/slider';
import RenderText from './RenderText';
import {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetModal,
  BottomSheetModalProvider,
} from '@gorhom/bottom-sheet';
import {useAuth} from '../../context/AuthContext';
import {IMAGES} from '../../constans/images';
import FastImage from 'react-native-fast-image';

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

const EditDetailStoryScreen = () => {
  const navigation = useNavigation();
  const viewShot = useRef<ViewShot>(null);
  const [uriCapture, setUriCapture] = useState('');
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
  const {bottomSheetModalRef, handleSheetChanges, handlePresentModalPress} =
    useAuth();
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
        keyboardVerticalOffset={60}
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
              shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 5,
              },
              shadowOpacity: 0.36,
              shadowRadius: 6.68,
              elevation: 11,
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

  const handleUploadStory = () => {
    captureRef(viewShot, {
      format: 'jpg',
      quality: 0.8,
    }).then(uri => {
      // console.log('URI CAPTURE', uri);
      // setUriCapture(uri);
      navigation.navigate({
        name: 'StoryScreen',
        params: {
          uriCapture: uri,
        },
      } as never);
    });
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
        style={{backgroundColor: COLORS.TEXT_BLACK_COLOR}}>
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
              </View>
              <TouchableOpacity onPress={handleChangeBackground}>
                <LinearGradient
                  start={{x: 0, y: 0.1}}
                  end={{x: 0.7, y: 0.4}}
                  colors={LIST_BG_EDIT[indexBG]}
                  style={styles.touchChangeColor}></LinearGradient>
              </TouchableOpacity>
            </View>
          )}
          <ViewShot
            style={{flex: 1, backgroundColor: COLORS.TEXT_BLACK_COLOR}}
            ref={viewShot}>
            <LinearGradient
              start={{x: 0, y: 0.1}}
              end={{x: 0.7, y: 0.3}}
              colors={LIST_BG_EDIT[indexBG]}
              style={styles.container}>
              {uriCapture.length > 0 && (
                <FastImage
                  source={{uri: uriCapture}}
                  resizeMode="contain"
                  style={{width: 200, height: 200}}
                />
              )}
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
                          listTextStory.length === 0 ? 'Nhấn để nhập...' : ''
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
            </LinearGradient>
          </ViewShot>

          <View style={styles.bottomTool}>
            {!isTouchView && !showDrawView && !showSheet && (
              <>
                <TouchableOpacity style={{alignItems: 'center'}}>
                  <Icon name="settings" size={25} color={COLORS.WHITE_COLOR} />
                  <AppText
                    text="Quyền riêng tư"
                    textColor={COLORS.WHITE_COLOR}
                    style={{marginTop: 5}}
                    textFont="bold"
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
    height: DIMENSIONS.height - 60,
    position: 'relative',
  },
  container: {
    flex: 1,
    // backgroundColor: COLORS.BG_EDIT_STORY_COLOR,
    paddingVertical: 20,
    flexShrink: 1,
    borderBottomStartRadius: 25,
    borderBottomEndRadius: 25,
  },

  headerEdit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 30,
    left: 15,
    right: 15,
    zIndex: 99,
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
  },
  touchInput: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomTool: {
    width: DIMENSIONS.width,
    height: DIMENSIONS.height * 0.1,
    paddingHorizontal: 15,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    height: DIMENSIONS.height * 0.9 - 60,
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
    zIndex: -99,
  },
});
