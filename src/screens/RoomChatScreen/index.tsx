import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Header from '../../components/Header';
import {IUser} from '../../types/userType';
import ImageAvatar from '../../components/ImageAvatar';
import AppText from '../../components/AppText';
import {COLORS} from '../../constans/colors';
import {DIMENSIONS} from '../../constans/dimensions';
import RenderMessage from './RenderMessage';
import {IMessage} from '../../types/messageType';
import {useAppSelector} from '../../redux/hook';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-crop-picker';
import * as Progress from 'react-native-progress';
import {useEffect, useRef, useState} from 'react';
import {ImageOrVideo} from 'react-native-image-crop-picker';
import {getRoomId} from '../../utils/createRoom';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import {db, storage} from '../../../FirebaseConfig';
import {getDownloadURL, ref, uploadBytesResumable} from 'firebase/storage';
import DeviceInfo from 'react-native-device-info';
import FastImage from 'react-native-fast-image';
import {useAuth} from '../../context/AuthContext';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import Video from 'react-native-video';

// check phone have bunny ear
const checkNotch = DeviceInfo.hasNotch();

const RoomChatScreen = ({route}: any) => {
  const {getStatusByUserId} = useAuth();
  const {user} = useAppSelector(state => state.user);
  const {chatUser}: {chatUser: IUser} = route?.params;
  const [message, setMessage] = useState('');
  const [userStatus, setUserStatus] = useState(false);
  const inputRef = useRef<TextInput>(null);
  const [responseImage, setResponseImage] = useState<ImageOrVideo[]>([]);
  const [dataMessage, setDataMessage] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [useKeyBoard, setUseKeyboard] = useState(true);
  const [roomId, setRoomId] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    createRoom();
    updateSeenMessage();
    const getRoom: string = getRoomId(user.userId, chatUser.userId);

    const docRef = doc(db, 'rooms', getRoom);
    const messageRef = collection(docRef, 'messages');
    const q = query(messageRef, orderBy('createAt', 'asc'));

    const unsub = onSnapshot(q, async snapshot => {
      // get status active
      const status = await getStatusByUserId(chatUser.userId);
      setUserStatus(status);
      let getMessage = snapshot.docs.map(doc => {
        return doc.data();
      }) as IMessage[];
      setDataMessage(getMessage.reverse());
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setUseKeyboard(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        if (Platform.OS === 'android') setUseKeyboard(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const updateSeenMessage = async () => {
    const docRef = doc(
      db,
      'friends',
      user.userId,
      'listFriend',
      chatUser.userId,
    );
    await updateDoc(docRef, {
      newMessage: false,
    });
  };
  const createRoom = async () => {
    const create = getRoomId(user.userId, chatUser.userId);
    setRoomId(create);
    if (user.userId !== chatUser.userId) {
      await setDoc(doc(db, 'rooms', create), {
        roomId: create,
        createAt: Timestamp.fromDate(new Date()),
      });
    }
  };
  const handleSendMessage = async () => {
    try {
      //update mess user support
      await updateDoc(doc(db, 'rooms', roomId), {
        createAt: Timestamp.fromDate(new Date()),
      });

      //handle send mess

      if (responseImage.length > 0) {
        await Promise.all(
          responseImage.map(async val => {
            await uploadFile(val.path, val.mime);
          }),
        );
      } else {
        const roomRef = doc(db, 'rooms', roomId);
        const messageRef = collection(roomRef, 'messages');
        const newDoc = await addDoc(messageRef, {
          userId: user.userId,
          userName: user.userName,
          message: message,
          path: '',
          type: '',
          checkNew: true,
          createAt: Timestamp.fromDate(new Date()),
        });
        await updateLastMessage('');
        console.log('message send', newDoc.id);
        setMessage('');
        inputRef.current?.clear();
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message);
      console.log('ERROR send message', error?.message);
    }
  };
  const updateLastMessage = async (typeMessage: string) => {
    // update
    const docRef = doc(
      db,
      'friends',
      user.userId,
      'listFriend',
      chatUser.userId,
    );
    const docRef2 = doc(
      db,
      'friends',
      chatUser.userId,
      'listFriend',
      user.userId,
    );
    await Promise.all([
      updateDoc(docRef, {
        lastMessage: message,
        newMessage: true,
        typeMessage,
        createMessage: Timestamp.fromDate(new Date()),
        userIdLastSend: user.userId,
      }),
      updateDoc(docRef2, {
        lastMessage: message,
        newMessage: true,
        typeMessage,
        createMessage: Timestamp.fromDate(new Date()),
        userIdLastSend: user.userId,
      }),
    ]);
  };
  const handlePickerImage = () => {
    ImagePicker.openPicker({
      multiple: true,
      waitAnimationEnd: false,
      sortOrder: 'desc',
      forceJpg: true,
    })
      .then(images => {
        const temp = responseImage;

        if (images.length > 2) {
          Alert.alert('Thông báo', 'Chọn tối đa 2 hình hoặc video');
          return;
        }
        temp.push(...images);
        const unique = temp.filter((obj, index) => {
          return index === temp.findIndex(o => obj.path === o.path);
        });
        console.log('UNI', unique);
        setMessage('');
        setResponseImage(unique);
      })
      .catch(e => console.log('IMAGE PICKER: ', e.message));
  };

  const handleDeleteImage = (index: number) => {
    const newImages = responseImage.filter((_, _index) => _index !== index);

    setResponseImage(newImages);
  };

  const uploadFile = async (uri: string, fileType: string) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, 'Chat/' + new Date().getTime());
    const uploadTask = uploadBytesResumable(storageRef, blob, {
      contentType: fileType,
    });
    console.log('UPLOAD', response);

    // listen for events
    uploadTask.on(
      'state_changed',
      snapshot => {
        const progressLoad =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progressLoad + '% done');
        setProgress(progress + progressLoad / responseImage.length);
      },
      error => {
        // handle error
        console.log('ERROR upload image', error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then(async downloadURL => {
          console.log('File available at', downloadURL);
          // save record
          const type = fileType.indexOf('image') > -1 ? 'image' : 'video';
          await saveRecord(type, downloadURL);
        });
      },
    );
  };
  const saveRecord = async (fileType: string, url: string) => {
    try {
      const roomRef = doc(db, 'rooms', roomId);
      const messageRef = collection(roomRef, 'messages');
      const newDoc = await addDoc(messageRef, {
        userId: user.userId,
        userName: user.userName,
        message: '',
        path: url,
        type: fileType,
        checkNew: true,
        createAt: Timestamp.fromDate(new Date()),
      });
      setResponseImage([]);
      setProgress(0);
      updateLastMessage(fileType);
      console.log('message send', newDoc.id);
    } catch (error) {
      Alert.alert('Lỗi upload mess image', error as any);
    }
  };

  return (
    <GestureHandlerRootView>
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: COLORS.WHITE_COLOR,
          position: 'relative',
          paddingTop: Platform.OS === 'android' ? 0 : 60,
        }}>
        <KeyboardAvoidingView
          enabled={useKeyBoard}
          behavior={'height'}
          keyboardVerticalOffset={Platform.OS === 'android' ? 0 : -15}
          style={{
            width: DIMENSIONS.width,
            height: checkNotch ? DIMENSIONS.height - 60 : DIMENSIONS.height,
            paddingBottom: 15,
          }}>
          <View style={styles.container}>
            <StatusBar barStyle={'dark-content'} />
            <Header
              styleHeader={{
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 99,
              }}
              iconGoBackRight
              titleHeader={
                <View>
                  <AppText
                    text={chatUser.userName}
                    textFont="bold"
                    style={styles.nameUser}
                    textSize={18}
                    numberOfLines={1}
                  />
                  <AppText
                    text={userStatus ? 'Đang hoạt động' : 'Không hoạt động'}
                    textColor={COLORS.LIGHT_GRAY}
                  />
                </View>
              }
              styleTitle={styles.titleHeader}
              leftHeader={
                <View style={{position: 'relative'}}>
                  <ImageAvatar
                    data={chatUser.photoUrl}
                    imageProp={{style: styles.avatarIcon}}
                  />
                  {userStatus && (
                    <View style={styles.viewDot}>
                      <View style={styles.dotOnl} />
                    </View>
                  )}
                </View>
              }
            />
            <Progress.Bar
              progress={progress}
              width={DIMENSIONS.width}
              height={3}
              borderRadius={0}
              borderWidth={0}
            />
            <FlatList
              data={dataMessage}
              keyExtractor={(_, _index) => `message-${_index}`}
              renderItem={({item}) => <RenderMessage {...item} />}
              style={styles.flatListMess}
              contentContainerStyle={styles.viewChat}
              inverted
            />
            <View style={styles.viewInput}>
              {responseImage.length > 0 ? (
                <View style={styles.viewPickImage}>
                  {responseImage.map((item, index) => {
                    return (
                      <View
                        key={`select-${index}`}
                        style={{
                          paddingHorizontal: 5,
                          position: 'relative',
                        }}>
                        {item.mime === 'image' ? (
                          <Image
                            resizeMode="cover"
                            resizeMethod="scale"
                            style={styles.imagePick}
                            source={{uri: item.path}}
                          />
                        ) : (
                          <Video
                            resizeMode="cover"
                            paused
                            style={styles.imagePick}
                            source={{uri: item.path}}
                          />
                        )}
                        <TouchableOpacity
                          style={styles.iconClose}
                          onPress={() => handleDeleteImage(index)}>
                          <Icon
                            name="close"
                            size={20}
                            color={COLORS.TEXT_BLACK_COLOR}
                          />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <TextInput
                  ref={inputRef}
                  placeholder="Soạn văn bản..."
                  style={styles.inputMess}
                  onChangeText={val => setMessage(val)}
                  multiline
                />
              )}
              <View
                style={[
                  styles.viewTouch,
                  responseImage.length > 0 && styles.fixTop,
                ]}>
                <TouchableOpacity
                  style={styles.touchImage}
                  onPress={handlePickerImage}>
                  <Icon
                    name="image"
                    size={25}
                    color={COLORS.TEXT_BLACK_COLOR}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.touchSendMess}
                  disabled={message.length <= 0 && responseImage.length <= 0}
                  onPress={handleSendMessage}>
                  <Icon
                    name="send"
                    size={25}
                    color={
                      message.length <= 0 && responseImage.length <= 0
                        ? COLORS.LIGHT_GRAY
                        : COLORS.TEXT_BLACK_COLOR
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default RoomChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
  },
  titleHeader: {
    justifyContent: 'flex-start',
  },
  avatarIcon: {
    width: 35,
    height: 35,
    borderRadius: 40,
    marginLeft: 5,
  },
  nameUser: {
    color: COLORS.TEXT_BLACK_COLOR,
    marginBottom: 10,
  },
  viewDot: {
    padding: 3,
    backgroundColor: COLORS.WHITE_COLOR,
    borderRadius: 20,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
  dotOnl: {
    width: 7,
    height: 7,
    borderRadius: 20,
    backgroundColor: COLORS.GREEN_ONLINE_COLOR,
  },
  viewChat: {
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  flatListMess: {
    flex: 1,
    backgroundColor: COLORS.MESSAGE_GRAY_COLOR,
  },

  viewInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: COLORS.WHITE_COLOR,
    maxHeight: 150,
  },
  viewPickImage: {
    width: DIMENSIONS.width - 100,
    flexDirection: 'row',
  },
  imagePick: {
    width: 100,
    height: 100,
    borderWidth: 0.5,
    borderColor: COLORS.LIGHT_GRAY,
    borderRadius: 8,
  },
  iconClose: {
    position: 'absolute',
    right: 0,
    zIndex: 99,
    backgroundColor: COLORS.INPUT_GRAY,
    borderRadius: 50,
    padding: 3,
  },
  inputMess: {
    width: DIMENSIONS.width - 120,
    paddingHorizontal: 10,
  },
  viewTouch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 70,
  },
  fixTop: {
    position: 'absolute',
    top: 5,
    right: 10,
  },
  touchImage: {
    paddingVertical: 5,
    alignItems: 'center',
    width: 30,
  },
  touchSendMess: {
    paddingVertical: 5,
    alignItems: 'center',
    width: 30,
  },
});
