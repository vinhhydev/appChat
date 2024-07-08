import {BottomSheetModalMethods} from '@gorhom/bottom-sheet/lib/typescript/types';
import {User} from 'firebase/auth';
import {
  DocumentData,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from 'firebase/firestore';
import {IUser} from '../../types/userType';

export interface IAuthContext {
  login: (
    email: string,
    password: string,
  ) => Promise<
    | {
        success: boolean;
        mess?: string;
      }
    | {
        success: boolean;
        mess: string;
      }
    | undefined
  >;
  register: (
    userName: string,
    email: string,
    password: string,
  ) => Promise<
    | {
        success: boolean;
        data: User;
        mess?: string;
      }
    | {
        success: boolean;
        mess: string;
        data?: undefined;
      }
  >;
  logout: () => Promise<
    | {
        success: boolean;
        message?: string;
      }
    | {
        success: boolean;
        message: string;
      }
  >;
  handleLoginWithFacebook: () => Promise<
    | {
        success: boolean;
        mess?: string;
      }
    | {
        success: boolean;
        mess: string;
      }
    | undefined
  >;
  handleLoginWithGoogle: () => Promise<
    | {
        success: boolean;
        data: User;
      }
    | {
        success: boolean;
        data?: undefined;
      }
  >;
  isLogin: boolean;
  user: IUser | undefined;
  bottomSheetModalRef: React.RefObject<BottomSheetModalMethods>;
  handlePresentModalPress: () => void;
  handleSheetChanges: (index: number) => void;
  handleDismissModalPress: () => void;
  getSuggestFriends: () => Promise<IUser[]>;
  searchFriends: (
    textSearch: string,
  ) => Promise<QuerySnapshot<DocumentData, DocumentData>>;
  addFriend: (friend: IUser) => Promise<{
    success: boolean;
  }>;
  checkIsFriend: (userId: string) => Promise<boolean>;
  getListFriend: () => Promise<IUser[]>;
  getStatusByUserId: (userId: string) => Promise<boolean>;
}
