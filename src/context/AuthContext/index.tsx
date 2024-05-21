import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {IAuthContext} from './IAuthContext';
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import {LoginManager, Profile, Settings} from 'react-native-fbsdk-next';
import {auth as myAuth, db, userRef, friendRef} from '../../../FirebaseConfig';
import {
  addDoc,
  and,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  or,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {Alert, Platform} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {BottomSheetModal} from '@gorhom/bottom-sheet';
import {IUser} from '../../types/userType';
const AuthContext = createContext({});

//setting app id facebook sign in
Settings.setAppID('769560871949046');

//setting google sign in
GoogleSignin.configure({
  webClientId:
    Platform.OS === 'android'
      ? '206561640153-ail6lv8o0809de69b7mnq3cd1uparmm7.apps.googleusercontent.com'
      : '206561640153-6tlr2uco4ns0hgvaufq0fb0cokm3jjs2.apps.googleusercontent.com',
});

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<IUser>();
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
  }, []);
  useEffect(() => {
    const unSub = onAuthStateChanged(myAuth, async dataUser => {
      console.log('auth change', user);
      if (dataUser) {
        setIsLogin(true);
        const data = (await getInforUser(dataUser.uid)) as IUser;
        setUser(data);
      } else {
        setIsLogin(false);
        setUser(undefined);
      }
    });
    return unSub;
  }, []);

  const getInforUser = async (userId: string) => {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.data();
  };
  const login = async (email: string, password: string) => {
    try {
      const response = await signInWithEmailAndPassword(
        myAuth,
        email,
        password,
      );
      console.log('Login: ', response.user);
      return {success: true};
    } catch (ex) {
      if (ex instanceof Error) {
        let msg = ex.message;
        console.log('Error Login', msg);
        if (msg.includes('(auth/invalid-email)')) {
          msg = 'Email không đúng định dạng';
        } else if (msg.includes('(auth/invalid-credential)')) {
          msg = 'Email hoặc mật khẩu không đúng';
        }
        return {success: false, mess: msg};
      }
    }
  };
  const logout = async () => {
    try {
      await signOut(myAuth);
      return {success: true};
    } catch (ex) {
      return {success: false, message: ex};
    }
  };
  const register = async (
    userName: string,
    email: string,
    password: string,
  ) => {
    try {
      const response = await createUserWithEmailAndPassword(
        myAuth,
        email,
        password,
      );
      updateProfile(response.user, {
        displayName: userName,
      });
      const dataUser = {
        userName,
        email,
        userId: response.user.uid,
        address: '',
        photoUrl: '',
      };
      console.log('created User: ', response.user);
      // create user
      await setDoc(doc(db, 'users', response.user.uid), dataUser);
      // create list friends of user
      // const friendsRef = doc(db, 'friends', response.user.uid);
      // const listFriendRef = collection(friendsRef, 'listFriend');
      // await addDoc(listFriendRef, {});
      return {success: true, data: response.user};
    } catch (ex) {
      console.log('ERROR REGISTER', ex);
      if (ex instanceof Error) {
        let msg = ex.message;
        if (msg.includes('(auth/weak-password)')) {
          msg = 'Mật khẩu ít nhất 6 ký tự';
        } else if (msg.includes('(auth/invalid-email)')) {
          msg = 'Email không đúng định dạng';
        } else if (msg.includes('(auth/email-already-in-use)')) {
          msg = 'Email này đã tồn tại';
        }
        return {success: false, mess: msg};
      }
    }
  };

  //Login with Facebook
  const handleLoginWithFacebook = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        'public_profile',
      ]);

      if (result.isCancelled) {
        console.log('Login facebook cancel');
        return {success: false};
      } else {
        const profile = await Profile.getCurrentProfile();
        if (!profile) {
          console.log('Facebook Profile', profile);
          return {success: true};
        }
      }
    } catch (ex) {
      console.log('Error Login facebook', ex);
      Alert.alert('Thông báo', 'Lỗi đăng nhập facebook');
      return {success: false, mess: ex};
    }
  };

  //Login with Google
  const handleLoginWithGoogle = async () => {
    try {
      // Check if your device supports Google Play
      await GoogleSignin.hasPlayServices({showPlayServicesUpdateDialog: true});
      // Get the users ID token
      const {idToken} = await GoogleSignin.signIn();
      // Create a Google credential with the token
      const googleCredential = GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      const response = await signInWithCredential(myAuth, googleCredential);
      //check exist account
      const q = query(userRef, where('userId', '==', response.user.uid));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.size <= 0) {
        const dataUser = {
          userName: response.user.displayName,
          email: response.user.email,
          userId: response.user.uid,
          address: '',
          photoUrl: response.user.photoURL,
        };
        await setDoc(doc(db, 'users', response.user.uid), dataUser);
      }
      console.log('SIGN IN WITH GOOGLE: ', response.user);
      return {success: true, data: response.user};
    } catch (ex) {
      console.log('ERROR SIGN IN WITH GOOGLE: ', ex);
      return {success: false};
    }
  };

  //get suggest friends
  const getSuggestFriends = async () => {
    const q = query(userRef, where('userId', '!=', user?.userId));
    const querySnapshot = await getDocs(q);
    const data: IUser[] = [];
    querySnapshot.forEach(val => {
      data.push(val.data() as IUser);
    });
    const listFriend = await getListFriend();
    //filter already friend
    const filter = data.filter(
      x => !listFriend.some(y => x.userId === y.userId),
    );
    return filter;
  };

  const getListFriend = async () => {
    const colRef = collection(db, 'friends', user?.userId!, 'listFriend');
    const q = query(colRef);
    const querySnapshot = await getDocs(q);
    const data: IUser[] = [];
    querySnapshot.forEach(val => {
      data.push(val.data() as IUser);
    });
    return data;
  };

  //search friends
  const searchFriends = async (textSearch: string) => {
    const q = query(
      userRef,
      or(
        and(
          where('userName', '>=', textSearch),
          where('userName', '<=', textSearch + '\uf8ff'),
        ),
        and(
          where(
            'userName',
            '>=',
            textSearch.charAt(0).toUpperCase() + textSearch.slice(1),
          ),
          where(
            'userName',
            '<=',
            textSearch.charAt(0).toUpperCase() + textSearch.slice(1) + '\uf8ff',
          ),
        ),
        and(
          where('userName', '>=', textSearch.toLowerCase()),
          where('userName', '<=', textSearch.toLowerCase() + '\uf8ff'),
        ),
      ),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot;
  };

  const addFriend = async (friend: IUser) => {
    try {
      // add to list friend of user
      const friendsRef = doc(
        db,
        'friends',
        user?.userId!,
        'listFriend',
        friend.userId,
      );
      // const listFriendRef = collection(friendsRef, 'listFriend');

      // add to list friend of person added
      const friendsAddedRef = doc(
        db,
        'friends',
        friend.userId,
        'listFriend',
        user?.userId!,
      );
      // const listFriendAddedRef = collection(friendsAddedRef, 'listFriend');

      await Promise.all([
        setDoc(friendsRef, {
          userId: friend.userId,
          userName: friend.userName,
          address: friend.address,
          photoUrl: friend.photoUrl,
        }),
        setDoc(friendsAddedRef, {
          userId: user?.userId,
          userName: user?.userName,
          address: user?.address,
          photoUrl: user?.photoUrl,
        }),
      ]);
      return {success: true};
    } catch (ex) {
      console.log('ADD FRIEND ERROR: ', ex);
      return {success: false};
    }
  };

  const checkIsFriend = async (userId: string) => {
    const docRef = doc(db, 'friends', user?.userId!, 'listFriend', userId);
    const docSnap = await getDoc(docRef);
    return docSnap.exists();
  };

  const dataProvider = {
    login,
    register,
    logout,
    handleLoginWithFacebook,
    handleLoginWithGoogle,
    isLogin,
    user,
    bottomSheetModalRef,
    handlePresentModalPress,
    handleSheetChanges,
    handleDismissModalPress,
    getSuggestFriends,
    searchFriends,
    addFriend,
    checkIsFriend,
    getListFriend,
  } as IAuthContext;
  return (
    <AuthContext.Provider value={dataProvider}>{children}</AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('Auth context error');
  }
  return context as IAuthContext;
};

export {AuthProvider, useAuth};
