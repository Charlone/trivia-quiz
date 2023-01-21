import { Action, combineReducers, configureStore, getDefaultMiddleware, ThunkAction } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import sessionReducer from '../features/session/SessionSlice';
import categoryReducer from '../features/category/CategorySlice';
import guestReducer from '../features/guest/GuestSlice';
import pointsReducer from '../features/points/PointsSlice';
import difficultyReducer from '../features/difficulty/DifficultySlice';
import typeReducer from '../features/type/TypeSlice';
import modalSelectionReducer from '../features/modalSelection/ModalSelectionSlice';
import isLoadingReducer from '../features/isLoading/IsLoadingSlice';
import urlReducer from '../features/url/UrlSlice';
import userReducer from '../features/user/UserSlice';

const persistConfig = {
    key: 'root',
    storage,
}

const reducer = combineReducers({
    session: sessionReducer,
    category: categoryReducer,
    guest: guestReducer,
    points: pointsReducer,
    difficulty: difficultyReducer,
    type: typeReducer,
    modalSelection: modalSelectionReducer,
    loading: isLoadingReducer,
    url: urlReducer,
    user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: [
        ...getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
            }
        })
    ]
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;

export const persistor = persistStore(store);