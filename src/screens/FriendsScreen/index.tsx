import {View, Text, StyleSheet, FlatList} from 'react-native';
import AppText from '../../components/AppText';
import {COLORS} from '../../constans/colors';
import {useEffect, useState} from 'react';
import {IUser} from '../../types/userType';
import {useAuth} from '../../context/AuthContext';
import {doc, getDoc} from 'firebase/firestore';
import {db} from '../../../FirebaseConfig';
import {useIsFocused} from '@react-navigation/native';
import RenderOnlFriends from './RenderOnlFriends';

const FriendsScreen = () => {
  const {getListFriend} = useAuth();
  const [listData, setListData] = useState<IUser[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    getFriendsOnl();
  }, [isFocused]);
  //get Friends Onlline
  const getFriendsOnl = async () => {
    const listFriend = await getListFriend();
    const listFriendOnl: IUser[] = [];
    await Promise.all(
      listFriend.map(async val => {
        const docRef = doc(db, 'users', val.userId);
        const getData = await getDoc(docRef);
        const data = getData.data() as IUser;
        if (data.status === true) {
          listFriendOnl.push(data);
        }
      }),
    );
    setListData(listFriendOnl);
  };
  return (
    <View style={styles.container}>
      <AppText
        text="Đang hoạt động"
        textColor={COLORS.LIGHT_GRAY}
        style={{fontWeight: '600'}}
      />

      {listData.length > 0 ? (
        <FlatList
          data={listData}
          keyExtractor={(_, _index) => `friend-${_index}`}
          renderItem={({item}) => <RenderOnlFriends {...item} />}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <AppText
          text="Không có bạn bè nào đang hoạt động"
          style={{alignSelf: 'center', position: 'absolute', top: '50%'}}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.WHITE_COLOR,
  },
});

export default FriendsScreen;
