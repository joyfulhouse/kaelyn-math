import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SectionId } from '@/types';

interface NavigationState {
  activeSection: SectionId;
  previousSection: SectionId | null;
}

const initialState: NavigationState = {
  activeSection: 'home',
  previousSection: null,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setActiveSection: (state, action: PayloadAction<SectionId>) => {
      state.previousSection = state.activeSection;
      state.activeSection = action.payload;
    },
    goBack: (state) => {
      if (state.previousSection) {
        const temp = state.activeSection;
        state.activeSection = state.previousSection;
        state.previousSection = temp;
      }
    },
  },
});

export const { setActiveSection, goBack } = navigationSlice.actions;
export default navigationSlice.reducer;
