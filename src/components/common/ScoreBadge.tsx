'use client';

interface ScoreBadgeProps {
  correct: number;
  total: number;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const sizeStyles = {
  sm: 'text-sm px-2 py-1',
  md: 'text-base px-3 py-1.5',
  lg: 'text-lg px-4 py-2',
};

export function ScoreBadge({
  correct,
  total,
  showPercentage = false,
  size = 'md',
}: ScoreBadgeProps) {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;

  // Color based on percentage
  const getColorClass = () => {
    if (percentage >= 80) return 'bg-sage/20 text-sage';
    if (percentage >= 60) return 'bg-yellow/20 text-yellow';
    return 'bg-coral/20 text-coral';
  };

  return (
    <div
      className={`
        inline-flex items-center gap-2 rounded-full font-display font-bold
        ${sizeStyles[size]}
        ${getColorClass()}
      `}
    >
      <span>
        {correct}/{total}
      </span>
      {showPercentage && (
        <span className="opacity-70">({percentage}%)</span>
      )}
    </div>
  );
}

// Star display component
interface StarDisplayProps {
  count: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
}

const starSizes = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export function StarDisplay({ count, maxStars = 5, size = 'md' }: StarDisplayProps) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }).map((_, i) => (
        <svg
          key={i}
          className={`${starSizes[size]} ${i < count ? 'text-yellow' : 'text-chocolate/20'}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ))}
    </div>
  );
}
