'use client';

import { useAppSelector, useAppDispatch } from '@/hooks/useRedux';
import { setActiveSection } from '@/store/navigationSlice';
import { Card } from '@/components/common';
import type { SectionId } from '@/types';

interface ModuleCard {
  id: SectionId;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const modules: ModuleCard[] = [
  {
    id: 'number-places',
    title: 'Number Places',
    description: 'Learn ones, tens, hundreds!',
    color: 'bg-coral hover:bg-coral/90',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
        <rect x="4" y="4" width="16" height="16" rx="4" fill="#FF7F6B" />
        <rect x="28" y="4" width="16" height="16" rx="4" fill="#8FBC8F" />
        <rect x="4" y="28" width="16" height="16" rx="4" fill="#FFD93D" />
        <rect x="28" y="28" width="16" height="16" rx="4" fill="#7EB5D6" />
        <text x="12" y="17" textAnchor="middle" className="fill-white font-display text-xs">1</text>
        <text x="36" y="17" textAnchor="middle" className="fill-white font-display text-xs">0</text>
        <text x="12" y="41" textAnchor="middle" className="fill-white font-display text-xs">0</text>
        <text x="36" y="41" textAnchor="middle" className="fill-white font-display text-xs">0</text>
      </svg>
    ),
  },
  {
    id: 'stacked-math',
    title: 'Stacked Math',
    description: 'Add & subtract vertically!',
    color: 'bg-sage hover:bg-sage/90',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
        <rect x="8" y="8" width="32" height="8" rx="2" fill="#8FBC8F" />
        <rect x="8" y="20" width="32" height="8" rx="2" fill="#8FBC8F" />
        <rect x="8" y="32" width="32" height="8" rx="2" fill="#FFD93D" />
      </svg>
    ),
  },
  {
    id: 'carry-over',
    title: 'Carry Over',
    description: 'Master carrying numbers!',
    color: 'bg-yellow hover:bg-yellow/90',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
        <path d="M24 38V10M24 10L14 20M24 10L34 20" stroke="#FFD93D" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'borrowing',
    title: 'Borrowing',
    description: 'Learn to borrow numbers!',
    color: 'bg-sky hover:bg-sky/90',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
        <path d="M24 10V38M24 38L14 28M24 38L34 28" stroke="#7EB5D6" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'multiplication',
    title: 'Multiplication',
    description: 'Times tables are fun!',
    color: 'bg-coral hover:bg-coral/90',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
        <path d="M14 14L34 34M34 14L14 34" stroke="#FF7F6B" strokeWidth="4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'division',
    title: 'Division',
    description: 'Share and divide equally!',
    color: 'bg-sage hover:bg-sage/90',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
        <circle cx="24" cy="12" r="4" fill="#8FBC8F" />
        <line x1="10" y1="24" x2="38" y2="24" stroke="#8FBC8F" strokeWidth="4" />
        <circle cx="24" cy="36" r="4" fill="#8FBC8F" />
      </svg>
    ),
  },
  {
    id: 'practice',
    title: 'Practice',
    description: 'Test your skills!',
    color: 'bg-yellow hover:bg-yellow/90',
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="h-12 w-12">
        <circle cx="24" cy="24" r="18" stroke="#FFD93D" strokeWidth="4" />
        <circle cx="24" cy="24" r="10" stroke="#FFD93D" strokeWidth="4" />
        <circle cx="24" cy="24" r="3" fill="#FFD93D" />
      </svg>
    ),
  },
];

export function HomeSection() {
  const dispatch = useAppDispatch();
  const userName = useAppSelector((state) => state.session.userName);
  const totalStars = useAppSelector((state) => state.session.totalStars);
  const lessonsCompleted = useAppSelector((state) => state.session.lessonsCompleted);

  const handleModuleClick = (sectionId: SectionId) => {
    dispatch(setActiveSection(sectionId));
  };

  return (
    <div className="space-y-8">
      {/* Hero Card */}
      <Card variant="elevated" className="bg-gradient-to-br from-paper to-cream">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="flex-shrink-0">
            <svg viewBox="0 0 200 160" fill="none" className="h-40 w-52">
              <ellipse cx="100" cy="145" rx="80" ry="10" fill="#E8DDD4" />
              <rect x="60" y="80" width="80" height="60" rx="8" fill="#8FBC8F" />
              <rect x="65" y="85" width="70" height="45" rx="4" fill="#F5F5F5" />
              <text x="100" y="115" textAnchor="middle" className="fill-chocolate font-display text-2xl">
                2+2=4
              </text>
              <circle cx="50" cy="60" r="25" fill="#FF7F6B" />
              <circle cx="50" cy="58" r="16" fill="#FFF8F0" />
              <circle cx="44" cy="54" r="3" fill="#4A3728" />
              <circle cx="56" cy="54" r="3" fill="#4A3728" />
              <path d="M42 64Q50 72 58 64" stroke="#4A3728" strokeWidth="2" fill="none" />
              <circle cx="150" cy="50" r="20" fill="#FFD93D" />
              <path d="M150 35L152 42L160 42L154 47L156 54L150 49L144 54L146 47L140 42L148 42Z" fill="#FFF8F0" />
            </svg>
          </div>
          <div className="text-center md:text-left">
            <h2 className="font-display text-3xl font-bold text-chocolate">
              Welcome, <span className="text-coral">{userName}</span>!
            </h2>
            <p className="mt-2 font-body text-lg text-chocolate/70">
              Ready for a math adventure? Pick a topic below and let&apos;s learn together!
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-4 md:justify-start">
              <div className="flex items-center gap-2 rounded-full bg-yellow/20 px-4 py-2">
                <svg className="h-5 w-5 text-yellow" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                </svg>
                <span className="font-display font-bold text-chocolate">{totalStars} Stars</span>
              </div>
              <div className="flex items-center gap-2 rounded-full bg-sage/20 px-4 py-2">
                <svg className="h-5 w-5 text-sage" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-display font-bold text-chocolate">
                  {lessonsCompleted.length} Completed
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Module Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {modules.map((module) => (
          <button
            key={module.id}
            onClick={() => handleModuleClick(module.id)}
            className={`
              group flex flex-col items-center gap-3 rounded-2xl p-6 text-cream
              shadow-soft transition-all duration-200
              hover:-translate-y-1 hover:shadow-lifted
              ${module.color}
            `}
          >
            <div className="rounded-xl bg-white/20 p-3">{module.icon}</div>
            <h3 className="font-display text-xl font-bold">{module.title}</h3>
            <p className="font-body text-sm text-cream/80">{module.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
