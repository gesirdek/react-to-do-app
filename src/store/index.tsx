import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import taskReducer from './modules/task';

const store = configureStore({
   reducer: { task: taskReducer }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store;