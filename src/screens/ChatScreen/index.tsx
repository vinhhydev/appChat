import {
  Dimensions,
  FlatList,
  SafeAreaView,
  StyleSheet,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {ActivityIndicator} from 'react-native';
import RenderListChat from './RenderListChat';
import {useAuth} from '../../context/AuthContext';
import {COLORS} from '../../constans/colors';
import {db} from '../../../FirebaseConfig';
import {DIMENSIONS} from '../../constans/dimensions';
import {useAppSelector} from '../../redux/hook';

export type DataListMess = {
  userId: string;
  userName: string;
  photoUrl: string;
  createAt: string;
  lastMessage: string;
  newMessage: boolean;
  userIdLastSend: string;
  typeMessage: 'video' | 'image' | '';
};
const ChatScreen = () => {
  const {user} = useAppSelector(state => state.user);
  const navigation = useNavigation();
  const [listMess, setListMess] = useState<DataListMess[]>();
  const [loading, setLoading] = useState(true);
  const isFocused = useIsFocused();
  useEffect(() => {
    createListFriend();

    const docRef = doc(db, 'friends', user?.userId!);
    const coll = collection(docRef, 'listFriend');
    const q = query(coll, orderBy('createMessage', 'desc'));
    const unsub = onSnapshot(q, async snapshot => {
      let getList = snapshot.docs.map(doc => {
        return {
          userId: doc.data().userId,
          userName: doc.data().userName,
          photoUrl: doc.data().photoUrl,
          createAt: doc.data().createMessage,
          lastMessage: doc.data().lastMessage,
          newMessage: doc.data().newMessage,
          userIdLastSend: doc.data().userIdLastSend,
          typeMessage: doc.data().typeMessage,
        };
      }) as DataListMess[];
      setListMess(getList);
      setLoading(false);
    });
    return unsub;
  }, [isFocused]);
  const createListFriend = async () => {
    const docRef = doc(db, 'friends', user?.userId!, 'listFriend', user.userId);
    await setDoc(docRef, {
      userId: user.userId,
    });
  };

  // useEffect(() => {
  //   if (listMess && listMess.length > 0) {
  //     setLoading(false);
  //   }
  // }, [listMess]);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator size={35} />
        ) : (
          <FlatList
            data={listMess}
            keyExtractor={(_, index) => `listRoom-${index}`}
            renderItem={({item}) => <RenderListChat {...item} />}
            contentContainerStyle={{
              paddingHorizontal: 15,
              paddingVertical: 15,
            }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    width: DIMENSIONS.width,
    height: DIMENSIONS.height,
    flexShrink: 1,
  },
  backgroundHeader: {
    backgroundColor: COLORS.WHITE_COLOR,
  },
});
