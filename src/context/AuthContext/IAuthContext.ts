import {User} from 'firebase/auth';

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
  handleLoginWithGoogle: () => Promise<{
    success: boolean;
  }>;
  isLogin: boolean;
  user: User | undefined;
}
