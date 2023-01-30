import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../app/store';

export interface ModalSelectionState {
    chosen: false | 'category' | 'difficulty' | 'type' | 'start' | 'playModal';
}

const initialState: ModalSelectionState = {
    chosen: false
}

export const modalSelectionSlice = createSlice({
    name: 'modalSelection',
    initialState,
    reducers: {
        setModalSelection: (state, action: PayloadAction<ModalSelectionState>) => {
            return Object.assign({}, state, action.payload);
        },
    }
})

export const { setModalSelection } = modalSelectionSlice.actions;

export const selectModal = (state: RootState) => state.modalSelection.chosen;

export default modalSelectionSlice.reducer;