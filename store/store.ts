import { Action, configureStore, PayloadAction, ThunkAction } from '@reduxjs/toolkit';
import rootReducer from './root';

export type RootState = ReturnType<typeof rootReducer>;
const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<T = void> = ThunkAction<T, RootState, unknown, Action<string>>;
export type ChainableThunk<T> = AppThunk<Promise<PayloadAction<T>>>;

export default store;
