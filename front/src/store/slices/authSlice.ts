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
        },
        
        resetUserId: () => initialState

    }
});

export const { setUserId, resetUserId } = authSlice.actions;
export default authSlice.reducer;