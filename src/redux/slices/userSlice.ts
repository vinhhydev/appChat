import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {IUser} from '../../types/userType';

interface UserState {
  user: IUser;
  listFriend: IUser[];
}

const initUser: IUser = {
  userName: '',
  userId: '',
  address: '',
  email: '',
  photoUrl: '',
  status: false,
};

export const initialState: UserState = {
  user: initUser,
  listFriend: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginUser: (state, action) => void (state.user = action.payload),
  },
  extraReducers: builder => {
    // viết các action bất động bộ
  },
});

export const UserStore = (state: RootState) => state.user; // get state
export const {loginUser} = userSlice.actions;
export default userSlice.reducer;
