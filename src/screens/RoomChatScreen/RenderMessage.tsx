import {Pressable, StyleSheet, Text, View} from 'react-native';
import {IMessage} from '../../types/messageType';
import AppText from '../../components/AppText';
import {COLORS} from '../../constans/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useAuth} from '../../context/AuthContext';
// import {ImagePreview} from 'react-native-images-preview';
import {DIMENSIONS} from '../../constans/dimensions';
import {ImagePreview} from '../../components/ImagePreview';

const RenderMessage = (props: IMessage) => {
  const {user} = useAuth();
  return user?.userId === props.userId ? (
    <View style={[styles.viewCurrentUser, styles.boxMessage]}>
      {props.message.length > 0 ? (
        <View style={styles.boxCurrentMess}>
          <AppText style={styles.textCurrentUser} text={props.message} />
        </View>
      ) : props.type === 'video' ? (
        <>
          <ImagePreview
            type={props.type}
            imageSource={{
              uri: props.path,
            }}
            imageStyle={[styles.imageMess]}
          />

          <Pressable style={styles.iconPlay}>
            <Icon name="play-arrow" size={30} color={COLORS.WHITE_COLOR} />
          </Pressable>
        </>
      ) : (
        <ImagePreview
          type={props.type}
          imageSource={{
            uri: props.path,
          }}
          imageStyle={[styles.imageMess]}
        />
      )}
    </View>
  ) : (
    <View style={[styles.viewRepUser, styles.boxMessage]}>
      {props.message.length > 0 ? (
        <View style={styles.boxRepMess}>
          <Text style={styles.textRepUser}>{props.message}</Text>
        </View>
      ) : props.type === 'video' ? (
        <>
          <ImagePreview
            type={props.type}
            imageSource={{
              uri: props.path,
            }}
            imageStyle={[styles.imageMess]}
          />
          <Pressable style={styles.iconPlay}>
            <Icon name="play-arrow" size={30} color={COLORS.WHITE_COLOR} />
          </Pressable>
        </>
      ) : (
        <ImagePreview
          type={props.type}
          imageSource={{
            uri: props.path,
          }}
          imageStyle={[styles.imageMess]}
        />
      )}
    </View>
  );
};

export default RenderMessage;

const styles = StyleSheet.create({
  boxMessage: {
    marginVertical: 10,
  },
  viewCurrentUser: {
    alignSelf: 'flex-end',
  },
  boxCurrentMess: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.FACEBOOK_COLOR,
    borderRadius: 15,
  },
  textCurrentUser: {
    color: COLORS.WHITE_COLOR,
  },
  viewRepUser: {
    alignSelf: 'flex-start',
  },
  boxRepMess: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: COLORS.WHITE_COLOR,
    borderRadius: 15,
  },
  textRepUser: {},
  imageMess: {
    // width: 100,
    // height: 100,
    maxWidth: DIMENSIONS.width * 0.7,
    maxHeight: 400,
    borderRadius: 10,
  },
  videoMess: {
    width: 150,
    height: 150,
  },
  iconPlay: {
    position: 'absolute',
    top: '50%',
    transform: [{translateY: -15}],
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 5,
    borderRadius: 30,
  },
});
