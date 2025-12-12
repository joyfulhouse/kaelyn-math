'use client';

import { useEffect } from 'react';
import { Header, SubjectTabs, Navigation, FloatingShapes } from '@/components/layout';
import { ErrorBoundary } from '@/components/common';
import {
  HomeSection,
  NumberPlacesSection,
  StackedMathSection,
  CarryOverSection,
  BorrowingSection,
  MultiplicationSection,
  DivisionSection,
  SetsPairsSection,
  PracticeSection,
  SightWordsSection,
  LettersSection,
  PhonicsSection,
} from '@/components/sections';
import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { loadSessionState } from '@/store/sessionSlice';
import type { SectionId } from '@/types';

const sectionComponents: Record<SectionId, React.ComponentType> = {
  // Global
  home: HomeSection,
  // Math sections
  'number-places': NumberPlacesSection,
  'stacked-math': StackedMathSection,
  'carry-over': CarryOverSection,
  borrowing: BorrowingSection,
  multiplication: MultiplicationSection,
  division: DivisionSection,
  'sets-pairs': SetsPairsSection,
  practice: PracticeSection,
  // Reading sections
  'sight-words': SightWordsSection,
  letters: LettersSection,
  phonics: PhonicsSection,
};

export default function Home() {
  const dispatch = useAppDispatch();
  const activeSection = useAppSelector((state) => state.navigation.activeSection);
  const sessionStatus = useAppSelector((state) => state.session.status);

  useEffect(() => {
    if (sessionStatus === 'idle') {
      dispatch(loadSessionState());
    }
  }, [dispatch, sessionStatus]);

  const ActiveSectionComponent = sectionComponents[activeSection];

  return (
    <div className="min-h-screen bg-cream">
      <FloatingShapes />
      <Header />
      <SubjectTabs />
      <Navigation />

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-8">
        <ErrorBoundary key={activeSection}>
          <ActiveSectionComponent />
        </ErrorBoundary>
      </main>
    </div>
  );
}
