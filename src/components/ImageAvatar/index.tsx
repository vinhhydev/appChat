import {View, Text, Image, ImageProps, StyleSheet} from 'react-native';
import React from 'react';
import {Helpers} from '../../common';
import {IMAGES} from '../../constans/images';

type PropImage = {
  imageProp: ImageProps;
  data: string;
};
const ImageAvatar = (props: PropImage) => {
  return (
    <Image
      {...props.imageProp}
      source={
        Helpers.isNullOrUndefined(props.data)
          ? IMAGES.avatar_user_default
          : {uri: props.data}
      }
      resizeMode="cover"
      style={[styles.image, props.imageProp.style]}
    />
  );
};

const styles = StyleSheet.create({
  image: {
    overflow: 'hidden',
  },
});
export default ImageAvatar;
