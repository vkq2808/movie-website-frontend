// features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { authApi, AuthResponse } from '@/redux/services/authApi';

interface AuthState {
  accessToken: string | null;
  user: any | null; // Bạn có thể định nghĩa kiểu chính xác cho User
}

const initialState: AuthState = {
  accessToken: null,
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Action để đăng xuất (logout)
    logout(state) {
      state.accessToken = null;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    // Khi login thành công, lưu thông tin auth vào state
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action: PayloadAction<AuthResponse>) => {
        state.accessToken = action.payload.accessToken;
        state.user = action.payload.user;
      }
    );
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
