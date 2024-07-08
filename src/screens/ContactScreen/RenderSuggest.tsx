import {Alert, Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {IUser} from '../../types/userType';
import AppText from '../../components/AppText';
import {Helpers} from '../../common';
import {IMAGES} from '../../constans/images';
import {DIMENSIONS} from '../../constans/dimensions';
import {COLORS} from '../../constans/colors';
import {useAuth} from '../../context/AuthContext';

type IDataProp = {
  item: IUser;
  index: number;
  listData: IUser[];
  setList: React.Dispatch<React.SetStateAction<IUser[]>>;
};

const RenderSuggest = (data: IDataProp) => {
  const {user, addFriend, checkIsFriend} = useAuth();
  const [checkFriend, setCheckFriend] = useState(false);
  useEffect(() => {
    handleIsFriend();
  }, [data.listData]);
  const handleAddFriend = async () => {
    const res = await addFriend(data.item);
    if (res) {
      Alert.alert('Thông báo', 'Thêm bạn thành công');
      const filterData = data.listData.filter(
        (_, _index) => _index !== data.index,
      );
      data.setList(filterData);
    }
  };
  const handleIsFriend = async () => {
    const check = await checkIsFriend(data.item.userId);
    setCheckFriend(check);
  };

  return (
    <View style={styles.containerItem}>
      <View style={styles.viewAvatar}>
        <Image
          source={
            Helpers.isNullOrUndefined(data.item.photoUrl)
              ? IMAGES.avatar_user_default
              : {uri: data.item.photoUrl}
          }
          style={styles.imageAvatar}
          resizeMode="contain"
        />
      </View>
      <View style={styles.viewInfor}>
        <AppText text={data.item.userName} textSize={18} />
        <View style={styles.addFriend}>
          {user?.userId !== data.item.userId && !checkFriend ? (
            <TouchableOpacity onPress={handleAddFriend}>
              <AppText
                text="Thêm bạn"
                textFont="bold"
                textColor={COLORS.FACEBOOK_COLOR}
              />
            </TouchableOpacity>
          ) : user?.userId === data.item.userId ? (
            <AppText text="Bạn" textFont="bold" textColor={COLORS.LIGHT_GRAY} />
          ) : (
            checkFriend && (
              <AppText text="Đã thêm bạn" textColor={COLORS.LIGHT_GRAY} />
            )
          )}
        </View>
      </View>
    </View>
  );
};

export default RenderSuggest;

const styles = StyleSheet.create({
  containerItem: {
    flex: 1,
    flexDirection: 'row',
    marginVertical: 7,
    backgroundColor: COLORS.WHITE_COLOR,
    paddingVertical: 10,
    paddingHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  viewAvatar: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewInfor: {
    flex: 3,
    paddingHorizontal: 10,
  },
  imageAvatar: {
    width: DIMENSIONS.wp(20),
    height: DIMENSIONS.hp(10),
  },
  addFriend: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});
