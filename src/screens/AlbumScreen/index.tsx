import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import AppText from '../../components/AppText';
import {useNavigation} from '@react-navigation/native';
import RenderAlbum from './RenderAlbum';
import {AlbumTracked} from '../EditStoryScreen';
import {COLORS} from '../../constans/colors';

const AlbumScreen = ({route}: any) => {
  const navigation = useNavigation();
  const {setChooseAlbum, album, setGallery, chooseAlbum} = route?.params;

  return (
    <View style={styles.container}>
      <View style={styles.headContent}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AppText text="Huỷ" textSize={16} textColor={COLORS.FACEBOOK_COLOR} />
        </TouchableOpacity>
        <View style={{justifyContent: 'center', alignItems: 'center'}}>
          <AppText text="Chọn Album" textFont="bold" textSize={18} />
        </View>
        <View />
      </View>

      <FlatList
        data={album as AlbumTracked[]}
        keyExtractor={(_, index) => `album-${index}`}
        renderItem={data => (
          <RenderAlbum
            data={data}
            setChooseAlbum={setChooseAlbum}
            setGallery={setGallery}
            chooseAlbum={chooseAlbum}
          />
        )}
      />
    </View>
  );
};

export default AlbumScreen;

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    backgroundColor: COLORS.WHITE_COLOR,
    flex: 1,
  },
  headContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
});
