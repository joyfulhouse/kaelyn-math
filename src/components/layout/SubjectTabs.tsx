'use client';

import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { setActiveSubject } from '@/store/navigationSlice';
import { SUBJECTS } from '@/lib/constants';
import { useAudio } from '@/hooks/useAudio';
import type { SubjectId } from '@/types';

export function SubjectTabs() {
  const activeSubject = useAppSelector((state) => state.navigation.activeSubject);
  const dispatch = useAppDispatch();
  const { clickSound, speak } = useAudio();

  const handleSubjectClick = (subjectId: SubjectId, label: string) => {
    if (subjectId === activeSubject) return; // Already on this subject
    clickSound();
    speak(`${label}!`);
    dispatch(setActiveSubject(subjectId));
  };

  return (
    <div className="sticky top-[68px] z-50 bg-cream/95 shadow-soft backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex justify-center gap-4 py-3">
          {SUBJECTS.map((subject) => {
            const isActive = activeSubject === subject.id;
            // Dynamic color classes based on subject
            const bgClass = isActive
              ? subject.color === 'coral'
                ? 'bg-coral'
                : 'bg-sage'
              : 'bg-paper';
            const hoverBgClass = !isActive
              ? subject.color === 'coral'
                ? 'hover:bg-coral/10'
                : 'hover:bg-sage/10'
              : '';

            return (
              <button
                key={subject.id}
                onClick={() => handleSubjectClick(subject.id, subject.label)}
                className={`
                  flex min-h-[56px] min-w-[120px] flex-col items-center justify-center gap-1
                  rounded-2xl px-6 py-3 font-display text-lg font-bold
                  transition-all duration-200
                  ${bgClass}
                  ${isActive ? 'text-cream shadow-lifted scale-105' : `text-chocolate ${hoverBgClass} hover:scale-102`}
                `}
                aria-label={subject.label}
                aria-pressed={isActive}
              >
                <svg
                  className="h-7 w-7"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={subject.icon} />
                </svg>
                <span className="text-sm">{subject.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
