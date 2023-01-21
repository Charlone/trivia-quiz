import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';
import {UserProfile} from "@auth0/nextjs-auth0/client";

// Define the initial state using that type
const initialState: UserProfile = {
    user : undefined
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<UserProfile>) => {
            return Object.assign({}, state, action.payload);
        },
        unSetUser: () => {
            return {user: undefined};
        },
    }
})

export const { setUser, unSetUser } = userSlice.actions;

export const selectUser = (state: RootState) => state;

export default userSlice.reducer;