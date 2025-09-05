import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ProfileData } from '../../types/profile.types';

interface ProfileState {
  data: ProfileData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProfileState = {
  data: null,
  loading: false,
  error: null,
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<ProfileData>) => {
      state.data = action.payload;
      state.error = null;
    },
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setProfileError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    updateProfileData: (state, action: PayloadAction<Partial<ProfileData>>) => {
      if (state.data) {
        state.data = { ...state.data, ...action.payload };
      }
    },
    clearProfileData: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  setProfileData,
  setProfileLoading,
  setProfileError,
  updateProfileData,
  clearProfileData,
} = profileSlice.actions;

export default profileSlice.reducer;