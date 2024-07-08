import {
  ListRenderItemInfo,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {PhotoIdentifier} from '@react-native-camera-roll/camera-roll';
import AppText from '../../components/AppText';
import FastImage from 'react-native-fast-image';
import {AlbumTracked, ChooseAlbum} from '../EditStoryScreen';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {COLORS} from '../../constans/colors';
import {useNavigation} from '@react-navigation/native';
import Video from 'react-native-video';
import {createThumbnail} from 'react-native-create-thumbnail';
type PropData = {
  data: ListRenderItemInfo<AlbumTracked>;
  setChooseAlbum: React.Dispatch<React.SetStateAction<ChooseAlbum | undefined>>;
  setGallery: React.Dispatch<
    React.SetStateAction<PhotoIdentifier[] | undefined>
  >;
  chooseAlbum: ChooseAlbum;
};

const RenderAlbum = (props: PropData) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={styles.containerItem}
      onPress={() => {
        props.setChooseAlbum({
          indexAlbum: props.data.index,
          titleAlbum: props.data.item.album.title,
        });
        navigation.goBack();
      }}>
      <View style={styles.contentItem}>
        <View style={styles.contentImage}>
          <FastImage
            source={{
              uri:
                props.data.item.album.title === 'Videos'
                  ? `data:image/jpeg;base64,${props.data.item.firstImage}`
                  : props.data.item.firstImage,
            }}
            style={styles.imageAlbum}
          />
        </View>

        <View style={{alignSelf: 'center'}}>
          <AppText
            text={props.data.item.album.title}
            textFont="bold"
            style={{marginBottom: 10}}
            textSize={16}
          />
          <AppText
            text={props.data.item.album.count.toString()}
            textColor={COLORS.LIGHT_GRAY}
          />
        </View>
      </View>
      {props.chooseAlbum.indexAlbum === props.data.index && (
        <Icon name="check" size={25} color={COLORS.FACEBOOK_COLOR} />
      )}
    </TouchableOpacity>
  );
};

export default RenderAlbum;

const styles = StyleSheet.create({
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  contentItem: {
    flexDirection: 'row',
  },
  contentImage: {
    width: 70,
    height: 70,
    marginRight: 15,
  },
  imageAlbum: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
});
