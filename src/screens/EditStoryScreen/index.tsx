import {
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import {
  Album,
  CameraRoll,
  PhotoIdentifier,
} from '@react-native-camera-roll/camera-roll';
import RenderAlbum from './RenderAlbum';
import {DIMENSIONS} from '../../constans/dimensions';
import AppText from '../../components/AppText';
import {useNavigation} from '@react-navigation/native';
import {Helpers} from '../../common';
import {COLORS} from '../../constans/colors';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {PaperProvider, Portal} from 'react-native-paper';
import {PermissionsAndroid} from 'react-native';

export interface Photo extends PhotoIdentifier {
  linkVideo?: string;
}

export type ChooseAlbum = {
  indexAlbum: number;
  titleAlbum: string;
};

export type AlbumTracked = {
  firstImage: string;
  album: Album;
};

const numColumns = 3;
const gap = 5;
const availableSpace = DIMENSIONS.width - (numColumns - 1) * gap;
const itemSize = availableSpace / numColumns;

const EditStoryScreen = () => {
  const [gallery, setGallery] = useState<Photo[]>();
  const [tempGallery, setTempGallery] = useState<Photo[]>();
  const [album, setAlbum] = useState<AlbumTracked[]>([]);
  const [chooseAlbum, setChooseAlbum] = useState<ChooseAlbum>();
  const navigation = useNavigation();
  useEffect(() => {
    if (Helpers.isNullOrUndefined(chooseAlbum)) {
      getAllMedia();
    } else {
      if (chooseAlbum?.indexAlbum === 0) {
        setGallery(tempGallery);
      } else if (chooseAlbum?.titleAlbum === 'Videos') {
        const temp = tempGallery?.filter(x => x.node.type === 'video');
        setGallery(temp);
      } else {
        const temp = tempGallery?.filter(
          x =>
            x.node.subTypes[0] &&
            chooseAlbum?.titleAlbum &&
            x.node.subTypes[0].toLowerCase().indexOf(
              chooseAlbum.titleAlbum
                .toLowerCase()
                .slice(0, chooseAlbum.titleAlbum.length - 1), // remove s in end title album
            ) > -1,
        );

        setGallery(temp);
      }
    }
  }, [chooseAlbum?.indexAlbum]);

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const getAllMedia = async () => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'All',
    })
      .then(async r => {
        let filterThumbnail: any[] = [];
        await Promise.all(
          r.edges.map(async val => {
            if (val.node.type.includes('video')) {
              if (Platform.OS === 'ios') {
                const photoThumbnail = await CameraRoll.getPhotoThumbnail(
                  val.node.image.uri,
                  {
                    allowNetworkAccess: true,
                    quality: 1,
                    targetSize: {
                      width: itemSize,
                      height: itemSize,
                    },
                  },
                );
                filterThumbnail.push({
                  linkVideo: val.node.image.uri,
                  node: {
                    ...val.node,
                    image: {
                      ...val.node.image,
                      uri: photoThumbnail.thumbnailBase64,
                    },
                  },
                });
              } else {
                filterThumbnail.push({
                  linkVideo: val.node.image.uri,
                  node: {...val.node},
                });
              }
            } else {
              filterThumbnail.push({
                linkVideo: '',
                node: {...val.node},
              });
            }
          }),
        );
        const sortMedia = filterThumbnail.sort(
          (a, b) => b.node.timestamp - a.node.timestamp,
        );

        setGallery(sortMedia);
        setTempGallery(sortMedia);
        // get Album
        CameraRoll.getAlbums({
          albumType: 'All',
          assetType: 'All',
        }).then(album => {
          // console.log('ALBUM', album);
          const tempAlbum: AlbumTracked[] = [];
          // get first image in album
          album.map((val, index) => {
            if (index === 0) {
              tempAlbum.push({
                firstImage: sortMedia[0].node.image.uri,
                album: val,
              });
            } else {
              let image;
              if (val.title.indexOf('Videos') > -1) {
                image = sortMedia.find(x => x.node.type === 'video')?.node.image
                  .uri;
              } else if (val.title.indexOf('Screenshots') > -1) {
                image = sortMedia.find(
                  x => x.node.subTypes[0] === 'PhotoScreenshot',
                )?.node.image.uri;
              } else {
                image = sortMedia.find(
                  x =>
                    x.node.subTypes[0]
                      .toLowerCase()
                      .indexOf(val.title.toLowerCase()) > -1,
                )?.node.image.uri;
              }
              tempAlbum.push({
                firstImage: image ?? '',
                album: val,
              });
            }
          });

          setAlbum(tempAlbum);
          setChooseAlbum({
            indexAlbum: 0,
            titleAlbum: album[0]?.title,
          });
        });
      })
      .catch(err => {
        //Error Loading Images
        console.log('ERROR load media', err);
      });
  };

  return (
    <PaperProvider>
      <Portal>
        <StatusBar barStyle={'light-content'} />
        <View style={styles.container}>
          <View style={styles.contentChoose}>
            <View style={styles.headContent}>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <AppText text="Huỷ" textSize={16} />
              </TouchableOpacity>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <AppText text="Thêm vào tin" textFont="bold" textSize={18} />
                <AppText text={chooseAlbum?.titleAlbum} textSize={14} />
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate({
                    name: 'AlbumScreen',
                    params: {
                      setChooseAlbum,
                      album,
                      setGallery,
                      chooseAlbum,
                    },
                  } as never)
                }>
                <AppText text="Album" textSize={16} />
              </TouchableOpacity>
            </View>
            <View style={styles.bodyContent}>
              <TouchableOpacity style={styles.btnEditStory}>
                <Icon
                  name="photo-camera"
                  size={35}
                  color={COLORS.TEXT_BLACK_COLOR}
                  style={{marginBottom: 15}}
                />
                <AppText text="Camera" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnEditStory}
                onPress={() =>
                  navigation.navigate('EditDetailStoryScreen' as never)
                }>
                <AppText
                  text="Aa"
                  textSize={35}
                  textColor={COLORS.TEXT_BLACK_COLOR}
                  style={{marginBottom: 15}}
                />
                <AppText text="Văn bản" />
              </TouchableOpacity>
            </View>
          </View>
          <FlatList
            data={gallery}
            keyExtractor={(_, index) => `media-${index}`}
            renderItem={data => <RenderAlbum data={data} itemSize={itemSize} />}
            numColumns={numColumns}
            columnWrapperStyle={{gap}}
            contentContainerStyle={{gap}}
          />
        </View>
      </Portal>
    </PaperProvider>
  );
};

export default EditStoryScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.WHITE_COLOR,
    flex: 1,
  },
  contentChoose: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  headContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bodyContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  btnEditStory: {
    backgroundColor: COLORS.INPUT_GRAY,
    width: DIMENSIONS.width / 2 - 45,
    height: DIMENSIONS.width / 2 - 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
});
