import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';
import rentalReducer from './rentalSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    rental: rentalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
