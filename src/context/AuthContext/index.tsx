import {createContext, useContext, useEffect, useState} from 'react';
import {IAuthContext} from './IAuthContext';
import {
  GoogleAuthProvider,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {LoginManager, Profile, Settings} from 'react-native-fbsdk-next';
import {auth as myAuth, db} from '../../../FirebaseConfig';
import {doc, setDoc} from 'firebase/firestore';
import {Alert, Platform} from 'react-native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

const AuthContext = createContext({});

//setting app id facebook sign in
Settings.setAppID('769560871949046');

//setting google sign in
GoogleSignin.configure({
  webClientId:
    Platform.OS === 'android'
      ? '486432815227-f2vj56qvp7c25vtbb0up8hgh1ir2fofg.apps.googleusercontent.com'
      : '486432815227-ok6m5mrahi04it7e6o7bf2o0tkrvovjo.apps.googleusercontent.com',
});

const AuthProvider = ({children}: {children: React.ReactNode}) => {
  const [isLogin, setIsLogin] = useState(false);
  const [user, setUser] = useState<User>();

  useEffect(() => {
    const unSub = onAuthStateChanged(myAuth, user => {
      console.log('auth change', user);
      if (user) {
        setIsLogin(true);
        setUser(user);
      } else {
        setIsLogin(false);
        setUser(undefined);
      }
    });
    return unSub;
  }, []);

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
      console.log('created User: ', response.user);
      await setDoc(doc(db, 'users', response.user.uid), {
        userName,
        email,
        userId: response.user.uid,
      });
      return {success: true, data: response.user};
    } catch (ex) {
      console.log('ERROR REGISTER', ex);
      if (ex instanceof Error) {
        let msg = ex.message;
        if (msg.includes('(auth/weak-password)')) {
          msg = 'Mật khẩu ít nhất 6 ký tự';
        } else if (msg.includes('(auth/invalid-email)')) {
          msg = 'Email không đúng định dạng';
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
      console.log('TOKEN ID GOOGLE', idToken);

      // Create a Google credential with the token

      const googleCredential = GoogleAuthProvider.credential(idToken);
      // Sign-in the user with the credential
      const response = await signInWithCredential(myAuth, googleCredential);
      console.log('SIGN IN WITH GOOGLE: ', response.user);
      return {success: true};
    } catch (ex) {
      console.log('ERROR SIGN IN WITH GOOGLE: ', ex);
      return {success: false};
    }
  };
  const dataProvider = {
    login,
    register,
    logout,
    handleLoginWithFacebook,
    handleLoginWithGoogle,
    isLogin,
    user,
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
