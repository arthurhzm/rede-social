import { createSlice } from "@reduxjs/toolkit";

interface AuthSliceState {
    userId: number;
}

const initialState: AuthSliceState = {
    userId: 0
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUserId(state, action) {
            state.userId = action.payload;
        }
    }
});

export const { setUserId } = authSlice.actions;
export default authSlice.reducer;