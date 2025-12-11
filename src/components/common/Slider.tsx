'use client';

interface SliderProps {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
  showValue?: boolean;
  color?: 'coral' | 'sage' | 'sky' | 'yellow';
  className?: string;
}

const colorClasses = {
  coral: {
    track: 'bg-coral/30',
    fill: 'bg-coral',
    thumb: 'bg-coral border-coral',
    label: 'text-coral',
  },
  sage: {
    track: 'bg-sage/30',
    fill: 'bg-sage',
    thumb: 'bg-sage border-sage',
    label: 'text-sage',
  },
  sky: {
    track: 'bg-sky/30',
    fill: 'bg-sky',
    thumb: 'bg-sky border-sky',
    label: 'text-sky',
  },
  yellow: {
    track: 'bg-yellow/30',
    fill: 'bg-yellow',
    thumb: 'bg-yellow border-yellow',
    label: 'text-yellow',
  },
};

export function Slider({
  value,
  min,
  max,
  onChange,
  label,
  showValue = true,
  color = 'coral',
  className = '',
}: SliderProps) {
  const colors = colorClasses[color];
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between">
          {label && (
            <label className="font-body text-sm text-chocolate/70">{label}</label>
          )}
          {showValue && (
            <span className={`font-display text-2xl font-bold ${colors.label}`}>
              {value}
            </span>
          )}
        </div>
      )}
      <div className="relative h-8 w-full">
        {/* Track background */}
        <div className={`absolute top-1/2 h-3 w-full -translate-y-1/2 rounded-full ${colors.track}`} />

        {/* Filled portion */}
        <div
          className={`absolute top-1/2 h-3 -translate-y-1/2 rounded-full transition-all duration-100 ${colors.fill}`}
          style={{ width: `${percentage}%` }}
        />

        {/* Native range input (invisible but functional) */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        />

        {/* Custom thumb */}
        <div
          className={`pointer-events-none absolute top-1/2 h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-cream shadow-medium transition-all duration-100 ${colors.thumb}`}
          style={{ left: `${percentage}%` }}
        />
      </div>

      {/* Scale markers */}
      <div className="flex justify-between px-1">
        {Array.from({ length: Math.min(max - min + 1, 13) }, (_, i) => {
          const step = (max - min) / Math.min(max - min, 12);
          const val = Math.round(min + i * step);
          if (i === 0 || i === Math.min(max - min, 12) || val === value) {
            return (
              <span
                key={i}
                className={`font-body text-xs ${
                  val === value ? colors.label + ' font-bold' : 'text-chocolate/40'
                }`}
              >
                {val}
              </span>
            );
          }
          return <span key={i} className="text-transparent">.</span>;
        })}
      </div>
    </div>
  );
}
