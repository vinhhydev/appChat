// Import the functions you need from the SDKs you need
import {initializeApp} from 'firebase/app';
import {getAnalytics} from 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import {getReactNativePersistence, initializeAuth} from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {collection, getFirestore} from 'firebase/firestore';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyApTgUMCkfgAcZt_OMGLFqkJIT5injDU18',
  authDomain: 'ringchat-1d35c.firebaseapp.com',
  projectId: 'ringchat-1d35c',
  storageBucket: 'ringchat-1d35c.appspot.com',
  messagingSenderId: '486432815227',
  appId: '1:486432815227:web:73289401116f5c59600ade',
  measurementId: 'G-2NBQ4JGEDK',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const userRef = collection(db, 'users');
export const roomRef = collection(db, 'rooms');
