import Reactotron from 'reactotron-react-native';
import {reactotronRedux} from 'reactotron-redux';

const reactotron = Reactotron.configure({
  name: 'RingChat',
}) // controls connection & communication settings
  .useReactNative({
    asyncStorage: true,
    networking: true,
  }) // add all built-in react native plugins
  .use(reactotronRedux())
  .connect(); // let's connect!

export default reactotron;
