import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import rootReducer from './root';

export type RootState = ReturnType<typeof rootReducer>;
const store = configureStore({
    reducer: rootReducer,
});

export type AppDispatch = typeof store.dispatch;
export type AppThunk<T = void> = ThunkAction<T, RootState, unknown, Action<string>>;

export default store;
