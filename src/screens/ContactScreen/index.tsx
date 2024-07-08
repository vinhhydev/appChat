import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetBackdropProps,
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useAuth} from '../../context/AuthContext';
import AppText from '../../components/AppText';
import {COLORS} from '../../constans/colors';
import {DIMENSIONS} from '../../constans/dimensions';
import {IUser} from '../../types/userType';
import RenderSuggest from './RenderSuggest';
import {Helpers} from '../../common';
import RenderListFriend from './RenderListFriend';

const ContactScreen = () => {
  const {
    bottomSheetModalRef,
    handleSheetChanges,
    getSuggestFriends,
    getListFriend,
    searchFriends,
  } = useAuth();
  const snapPoints = useMemo(() => ['50%', '80%'], []);
  const [isLoadding, setIsLoadding] = useState(false);
  const [textSearch, setTextSearch] = useState('');
  const [listSuggestFriend, setListSuggestFreind] = useState<IUser[]>([]);
  const [listSearch, setListSearch] = useState<IUser[]>([]);
  const [listFriend, setListFriend] = useState<IUser[]>([]);
  const [tempList, setTempList] = useState<IUser[]>([]);

  useEffect(() => {
    getFriends();
    loadSuggestFriends();
  }, [listSuggestFriend, listSearch]);
  const loadSuggestFriends = async () => {
    const getList = await getSuggestFriends();
    setListSuggestFreind(getList);
  };
  const getFriends = async () => {
    const listData = await getListFriend();
    setListFriend(listData);
    setTempList(listData);
  };

  const handleSearch = async () => {
    setIsLoadding(true);
    if (!Helpers.isNullOrUndefined(textSearch)) {
      const get = await searchFriends(textSearch.trim());
      const data: any = [];
      get.forEach(doc => {
        data.push(doc.data());
      });
      setListSearch(data);
      console.log('DATA SEARCH', data);
    } else {
      setListSearch([]);
    }
    setIsLoadding(false);
  };
  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        opacity={0}
        pressBehavior={'close'}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
      />
    ),
    [],
  );
  const handleSearchList = (text: string) => {
    const filterData = tempList.filter(x =>
      contains(x.userName.toLowerCase(), text.toLowerCase()),
    );
    setListFriend(filterData);
  };
  const contains = (userName: string, texSearch: string) => {
    if (userName.includes(texSearch)) {
      return true;
    }
    return false;
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={styles.containerList}>
        <TextInput
          placeholder="Tìm bạn liên hệ"
          style={styles.txtSearchFriend}
          placeholderTextColor={COLORS.PLACEHOLDER_TEXT_INPUT_COLOR}
          onChangeText={handleSearchList}
        />
        {listFriend.length > 0 ? (
          <FlatList
            data={listFriend}
            keyExtractor={(_, index) => `friend-${index}`}
            renderItem={({item}) => <RenderListFriend {...item} />}
          />
        ) : (
          <AppText
            text="Danh bạ chưa có liên hệ nào"
            style={{alignSelf: 'center', position: 'absolute', top: '50%'}}
          />
        )}
      </View>
      <BottomSheetModalProvider>
        <View style={styles.containerBottomSheet}>
          {/* show list friend here */}
          <BottomSheetModal
            ref={bottomSheetModalRef}
            index={1}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            backdropComponent={renderBackdrop}>
            <BottomSheetScrollView>
              <View style={styles.contentBottom}>
                <View style={styles.boxSearch}>
                  <TextInput
                    placeholder="Nhập tên cần tìm"
                    placeholderTextColor={COLORS.LIGHT_GRAY}
                    style={styles.inputSearch}
                    onChangeText={val => setTextSearch(val)}
                  />

                  <TouchableOpacity onPress={handleSearch}>
                    <AppText text="Tìm kiếm" textFont="bold" />
                  </TouchableOpacity>
                </View>
                {isLoadding ? (
                  <ActivityIndicator size={30} color={COLORS.PRIMARY_COLOR} />
                ) : (
                  listSearch.length > 0 && (
                    <View style={styles.viewSearch}>
                      <AppText
                        text="Kết quả tìm kiếm"
                        textSize={17}
                        textColor={COLORS.TEXT_SUGGESS_GRAY}
                        textFont="bold"
                      />
                      <FlatList
                        data={listSearch}
                        keyExtractor={(_, index) => `search-${index}`}
                        renderItem={({item, index}) => (
                          <RenderSuggest
                            item={item}
                            index={index}
                            listData={listSearch}
                            setList={setListSearch}
                          />
                        )}
                        scrollEnabled={false}
                      />
                    </View>
                  )
                )}
                <View style={styles.viewSuggest}>
                  <AppText
                    text="Gợi ý kết bạn"
                    textSize={17}
                    textColor={COLORS.TEXT_SUGGESS_GRAY}
                    textFont="bold"
                  />
                  {listSuggestFriend.length > 0 ? (
                    <FlatList
                      data={listSuggestFriend}
                      keyExtractor={(_, _index) => `suggest-${_index}`}
                      renderItem={({item, index}) => (
                        <RenderSuggest
                          item={item}
                          index={index}
                          listData={listSuggestFriend}
                          setList={setListSuggestFreind}
                        />
                      )}
                      horizontal={false}
                      showsVerticalScrollIndicator={false}
                      scrollEnabled={false}
                    />
                  ) : (
                    listSuggestFriend.length < 1 && (
                      <AppText
                        text={'Không có gợi ý nào'}
                        style={{alignSelf: 'center', marginTop: 10}}
                        textColor={COLORS.LIGHT_GRAY}
                      />
                    )
                  )}
                </View>
              </View>
            </BottomSheetScrollView>
          </BottomSheetModal>
        </View>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
};

export default ContactScreen;

const styles = StyleSheet.create({
  containerList: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.WHITE_COLOR,
  },
  txtSearchFriend: {
    backgroundColor: COLORS.INPUT_GRAY,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
  },
  containerBottomSheet: {
    flex: 1,
  },
  contentBottom: {
    padding: 20,
  },
  boxSearch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputSearch: {
    backgroundColor: COLORS.INPUT_GRAY,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    width: DIMENSIONS.wp(70),
  },
  viewSuggest: {
    marginVertical: 10,
  },
  viewSearch: {
    marginVertical: 10,
  },
});
