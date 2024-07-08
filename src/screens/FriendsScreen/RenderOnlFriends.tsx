import {StyleSheet, TouchableOpacity, View} from 'react-native';
import ImageAvatar from '../../components/ImageAvatar';
import {IUser} from '../../types/userType';
import AppText from '../../components/AppText';
import {COLORS} from '../../constans/colors';
import {useNavigation} from '@react-navigation/native';

const RenderOnlFriends = (props: IUser) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.containerItem}
      onPress={() =>
        navigation.navigate({
          name: 'RoomChatScreen',
          params: {
            chatUser: props,
          },
        } as never)
      }>
      <View style={styles.viewImg}>
        <ImageAvatar
          data={props.photoUrl}
          imageProp={{
            style: {
              width: 40,
              height: 40,
              borderRadius: 40 / 2,
            },
          }}
        />
        <View style={styles.viewDot}>
          <View style={styles.dotOnl} />
        </View>
      </View>
      <View style={styles.viewContent}>
        <AppText text={props.userName} />
      </View>
    </TouchableOpacity>
  );
};

export default RenderOnlFriends;

const styles = StyleSheet.create({
  containerItem: {
    paddingVertical: 5,
    marginVertical: 10,
    borderBottomWidth: 0.3,
    borderBottomColor: COLORS.LIGHT_GRAY,
    flexDirection: 'row',
  },
  viewImg: {
    padding: 5,
    position: 'relative',
  },
  viewDot: {
    padding: 2,
    backgroundColor: COLORS.WHITE_COLOR,
    borderRadius: 20,
    position: 'absolute',
    bottom: 5,
    right: 2,
  },
  dotOnl: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: COLORS.GREEN_ONLINE_COLOR,
  },
  viewContent: {
    paddingLeft: 10,
  },
});
