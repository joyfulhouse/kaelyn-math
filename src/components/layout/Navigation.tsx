'use client';

import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { setActiveSection } from '@/store/navigationSlice';
import { NAV_ITEMS } from '@/lib/constants';
import type { SectionId } from '@/types';

export function Navigation() {
  const activeSection = useAppSelector((state) => state.navigation.activeSection);
  const dispatch = useAppDispatch();

  const handleNavClick = (sectionId: SectionId) => {
    dispatch(setActiveSection(sectionId));
  };

  return (
    <nav className="sticky top-[68px] z-40 bg-cream/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-4">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-3 scrollbar-hide">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2 font-body text-sm font-medium transition-all duration-200 ${
                activeSection === item.id
                  ? 'bg-coral text-cream shadow-soft'
                  : 'bg-paper text-chocolate hover:bg-coral/10 hover:text-coral'
              }`}
              data-section={item.id}
            >
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d={item.icon} />
              </svg>
              <span>{item.shortLabel}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
