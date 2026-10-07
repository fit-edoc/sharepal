import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProductSummary {
  id: number;
  name: string;
  image: string;
  per_day_rent: number;
  tag?: string;
  rating?: number;
}

export interface RentalState {
  startDate: string | null;
  endDate: string | null;
  days: number;
  isDatesSelected: boolean;
  isDateModalOpen: boolean;
  activeProduct: ProductSummary | null;
}

const initialState: RentalState = {
  startDate: null,
  endDate: null,
  days: 0,
  isDatesSelected: false,
  isDateModalOpen: false,
  activeProduct: null,
};

export const rentalSlice = createSlice({
  name: 'rental',
  initialState,
  reducers: {
    openDateModal: (state, action: PayloadAction<ProductSummary | null | undefined>) => {
      state.isDateModalOpen = true;
      state.activeProduct = action.payload || null;
    },
    closeDateModal: (state) => {
      state.isDateModalOpen = false;
      state.activeProduct = null;
    },
    setRentalDates: (
      state,
      action: PayloadAction<{ startDate: string; endDate: string; days: number }>
    ) => {
      state.startDate = action.payload.startDate;
      state.endDate = action.payload.endDate;
      state.days = Math.max(1, action.payload.days);
      state.isDatesSelected = true;
    },
    resetRentalDates: (state) => {
      state.startDate = null;
      state.endDate = null;
      state.days = 0;
      state.isDatesSelected = false;
    },
  },
});

export const {
  openDateModal,
  closeDateModal,
  setRentalDates,
  resetRentalDates,
} = rentalSlice.actions;

export default rentalSlice.reducer;
