import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {DataListMess} from '.';
import {useNavigation} from '@react-navigation/native';
import {doc, updateDoc} from 'firebase/firestore';
import {db} from '../../../FirebaseConfig';
import {useAuth} from '../../context/AuthContext';
import {COLORS} from '../../constans/colors';
import AppText from '../../components/AppText';
import {useAppSelector} from '../../redux/hook';

const RenderListChat = (props: DataListMess) => {
  const {user} = useAppSelector(state => state.user);
  const navigation = useNavigation();
  const navigateRoomChat = () => {
    navigation.navigate({
      name: 'RoomChatScreen',
      params: {
        chatUser: props,
      },
    } as never);
  };

  return (
    <TouchableOpacity
      style={styles.containerList}
      onPress={() => navigateRoomChat()}>
      <Text style={styles.textName}>{props.userName}</Text>
      <Text style={styles.textMessage}>{`${
        user?.userId === props.userIdLastSend ? 'Bạn: ' : ''
      } ${
        props.typeMessage === 'image'
          ? 'Hình ảnh'
          : props.typeMessage === 'video'
          ? 'Video'
          : props.lastMessage.length > 0
          ? props.lastMessage
          : 'RingChat đã kết nối tin nhắn của 2 bạn'
      }`}</Text>
      {props.newMessage && props.userIdLastSend !== user.userId && (
        <View style={styles.dotNew} />
      )}
    </TouchableOpacity>
  );
};

export default RenderListChat;

const styles = StyleSheet.create({
  containerList: {
    backgroundColor: COLORS.WHITE_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 15,
    height: 80,
    position: 'relative',
    justifyContent: 'space-between',
    marginVertical: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  textName: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  textMessage: {},
  dotNew: {
    width: 15,
    height: 15,
    backgroundColor: COLORS.DOT_NEW_MESSAGE_COLOR,
    borderRadius: 20,
    position: 'absolute',
    right: 10,
    top: 5,
  },
});
