// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {getReactNativePersistence, initializeAuth} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {collection, getFirestore} from 'firebase/firestore';
import {getStorage} from 'firebase/storage';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyAzMmMaRaPNTFCjENi1TfNt9CVHhR3KNTw',
  authDomain: 'appchat-eb054.firebaseapp.com',
  projectId: 'appchat-eb054',
  storageBucket: 'appchat-eb054.appspot.com',
  messagingSenderId: '206561640153',
  appId: '1:206561640153:web:7d7e14c54d38990d4448c8',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);
export const storage = getStorage(app);

export const userRef = collection(db, 'users');
export const friendRef = collection(db, 'friends');
export const roomRef = collection(db, 'rooms');
