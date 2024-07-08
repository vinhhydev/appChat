module.exports = {
  project: {
    ios: {},
    android: {},
  },
  assets: ['./assets/fonts'],
  dependencies: {
    'react-native-vector-icons': {
      platforms: {
        ios: null,
      },
    },
    // ...(process.env.NO_FLIPPER
    //   ? {'react-native-flipper': {platforms: {ios: null}}}
    //   : {}),
  },
};
