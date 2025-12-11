'use client';

import { parseIntoPlaceValues } from '@/lib/mathUtils';
import type { PlaceValue } from '@/types';

interface PlaceValueDisplayProps {
  number: number;
  highlightPlace?: PlaceValue;
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const colorClasses: Record<PlaceValue, string> = {
  thousands: 'bg-coral text-cream',
  hundreds: 'bg-yellow text-chocolate',
  tens: 'bg-sage text-cream',
  ones: 'bg-sky text-cream',
};

const labelNames: Record<PlaceValue, string> = {
  thousands: 'Thousands',
  hundreds: 'Hundreds',
  tens: 'Tens',
  ones: 'Ones',
};

const sizeClasses = {
  sm: 'w-10 h-10 text-lg',
  md: 'w-14 h-14 text-2xl',
  lg: 'w-20 h-20 text-4xl',
};

export function PlaceValueDisplay({
  number,
  highlightPlace,
  showLabels = true,
  size = 'md',
}: PlaceValueDisplayProps) {
  const placeValues = parseIntoPlaceValues(number);
  const places: PlaceValue[] = ['thousands', 'hundreds', 'tens', 'ones'];

  // Determine which places to show (skip leading zeros)
  const firstNonZero = places.findIndex((p) => placeValues[p] > 0);
  const visiblePlaces = firstNonZero >= 0 ? places.slice(firstNonZero) : ['ones'];

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="flex gap-2">
        {(visiblePlaces as PlaceValue[]).map((place) => (
          <div
            key={place}
            className={`
              flex items-center justify-center rounded-xl font-display font-bold
              transition-all duration-200
              ${sizeClasses[size]}
              ${colorClasses[place]}
              ${highlightPlace === place ? 'ring-4 ring-chocolate scale-110' : ''}
            `}
          >
            {placeValues[place]}
          </div>
        ))}
      </div>

      {showLabels && (
        <div className="flex gap-2">
          {(visiblePlaces as PlaceValue[]).map((place) => (
            <div
              key={`label-${place}`}
              className={`
                text-center font-body text-xs
                ${size === 'sm' ? 'w-10' : size === 'md' ? 'w-14' : 'w-20'}
                ${highlightPlace === place ? 'font-bold text-chocolate' : 'text-chocolate/60'}
              `}
            >
              {labelNames[place]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Expanded view showing blocks for each place value
interface PlaceValueBlocksProps {
  number: number;
  animated?: boolean;
}

export function PlaceValueBlocks({ number, animated = false }: PlaceValueBlocksProps) {
  const placeValues = parseIntoPlaceValues(number);

  return (
    <div className="flex flex-wrap justify-center gap-6">
      {/* Thousands - Large cubes */}
      {placeValues.thousands > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-1">
            {Array.from({ length: placeValues.thousands }).map((_, i) => (
              <div
                key={`th-${i}`}
                className={`h-12 w-12 rounded-lg bg-coral shadow-sm ${animated ? 'animate-blockAppear' : ''}`}
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
          <span className="font-body text-sm text-chocolate/60">Thousands</span>
        </div>
      )}

      {/* Hundreds - Flat squares */}
      {placeValues.hundreds > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-1">
            {Array.from({ length: placeValues.hundreds }).map((_, i) => (
              <div
                key={`h-${i}`}
                className={`h-10 w-10 rounded-md bg-yellow shadow-sm ${animated ? 'animate-blockAppear' : ''}`}
                style={{ animationDelay: `${(placeValues.thousands + i) * 100}ms` }}
              />
            ))}
          </div>
          <span className="font-body text-sm text-chocolate/60">Hundreds</span>
        </div>
      )}

      {/* Tens - Sticks */}
      {placeValues.tens > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-1">
            {Array.from({ length: placeValues.tens }).map((_, i) => (
              <div
                key={`t-${i}`}
                className={`h-10 w-3 rounded bg-sage shadow-sm ${animated ? 'animate-blockAppear' : ''}`}
                style={{
                  animationDelay: `${(placeValues.thousands + placeValues.hundreds + i) * 100}ms`,
                }}
              />
            ))}
          </div>
          <span className="font-body text-sm text-chocolate/60">Tens</span>
        </div>
      )}

      {/* Ones - Small cubes */}
      {placeValues.ones > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex flex-wrap justify-center gap-1">
            {Array.from({ length: placeValues.ones }).map((_, i) => (
              <div
                key={`o-${i}`}
                className={`h-6 w-6 rounded bg-sky shadow-sm ${animated ? 'animate-blockAppear' : ''}`}
                style={{
                  animationDelay: `${(placeValues.thousands + placeValues.hundreds + placeValues.tens + i) * 100}ms`,
                }}
              />
            ))}
          </div>
          <span className="font-body text-sm text-chocolate/60">Ones</span>
        </div>
      )}
    </div>
  );
}
