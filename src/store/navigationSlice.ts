import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { SectionId, SubjectId } from '@/types';

interface NavigationState {
  activeSubject: SubjectId;
  activeSection: SectionId;
  previousSection: SectionId | null;
}

const initialState: NavigationState = {
  activeSubject: 'math',
  activeSection: 'home',
  previousSection: null,
};

const navigationSlice = createSlice({
  name: 'navigation',
  initialState,
  reducers: {
    setActiveSubject: (state, action: PayloadAction<SubjectId>) => {
      state.activeSubject = action.payload;
      state.previousSection = state.activeSection;
      state.activeSection = 'home'; // Reset to home when switching subjects
    },
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

export const { setActiveSubject, setActiveSection, goBack } = navigationSlice.actions;
export default navigationSlice.reducer;
