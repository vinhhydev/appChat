import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import AppText from '../../components/AppText';
import {IUser} from '../../types/userType';
import {COLORS} from '../../constans/colors';

import ImageAvatar from '../../components/ImageAvatar';

const RenderListFriend = (props: IUser) => {
  return (
    <TouchableOpacity style={styles.containerItem}>
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
      </View>
      <View style={styles.viewContent}>
        <AppText text={props.userName} />
      </View>
    </TouchableOpacity>
  );
};

export default RenderListFriend;

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
  },

  viewContent: {
    paddingLeft: 10,
  },
});
