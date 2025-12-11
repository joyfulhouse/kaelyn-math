'use client';

interface GroupingVisualProps {
  total: number;
  groups: number;
  itemsPerGroup?: number;
  animated?: boolean;
  showLabels?: boolean;
}

export function GroupingVisual({
  total,
  groups,
  itemsPerGroup,
  animated = false,
  showLabels = true,
}: GroupingVisualProps) {
  const perGroup = itemsPerGroup ?? Math.floor(total / groups);
  const remainder = total - perGroup * groups;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-4">
        {Array.from({ length: groups }).map((_, groupIndex) => (
          <div
            key={`group-${groupIndex}`}
            className={`
              flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed
              border-sage/50 bg-sage/10 p-4
              ${animated ? 'animate-groupAppear' : ''}
            `}
            style={{ animationDelay: animated ? `${groupIndex * 200}ms` : undefined }}
          >
            <div className="flex flex-wrap justify-center gap-1">
              {Array.from({ length: perGroup }).map((_, itemIndex) => (
                <div
                  key={`item-${groupIndex}-${itemIndex}`}
                  className={`
                    h-6 w-6 rounded-full bg-coral
                    ${animated ? 'animate-itemAppear' : ''}
                  `}
                  style={{
                    animationDelay: animated
                      ? `${groupIndex * 200 + itemIndex * 50}ms`
                      : undefined,
                  }}
                />
              ))}
            </div>
            {showLabels && (
              <span className="font-display text-sm font-bold text-sage">
                Group {groupIndex + 1}
              </span>
            )}
          </div>
        ))}

        {/* Remainder */}
        {remainder > 0 && (
          <div
            className={`
              flex flex-col items-center gap-2 rounded-2xl border-2 border-dashed
              border-yellow/50 bg-yellow/10 p-4
              ${animated ? 'animate-groupAppear' : ''}
            `}
            style={{ animationDelay: animated ? `${groups * 200}ms` : undefined }}
          >
            <div className="flex flex-wrap justify-center gap-1">
              {Array.from({ length: remainder }).map((_, itemIndex) => (
                <div
                  key={`remainder-${itemIndex}`}
                  className={`
                    h-6 w-6 rounded-full bg-yellow
                    ${animated ? 'animate-itemAppear' : ''}
                  `}
                  style={{
                    animationDelay: animated
                      ? `${groups * 200 + itemIndex * 50}ms`
                      : undefined,
                  }}
                />
              ))}
            </div>
            {showLabels && (
              <span className="font-display text-sm font-bold text-yellow">
                Leftover
              </span>
            )}
          </div>
        )}
      </div>

      {showLabels && (
        <div className="text-center font-display text-lg text-chocolate">
          <span className="font-bold">{total}</span> ÷{' '}
          <span className="font-bold">{groups}</span> ={' '}
          <span className="font-bold text-sage">{perGroup}</span>
          {remainder > 0 && (
            <span className="text-yellow"> R{remainder}</span>
          )}
        </div>
      )}
    </div>
  );
}

// Simple sharing story visual
interface SharingStoryProps {
  total: number;
  recipients: number;
  itemName?: string;
  recipientName?: string;
}

export function SharingStory({
  total,
  recipients,
  itemName = 'cookies',
  recipientName = 'friends',
}: SharingStoryProps) {
  const perPerson = Math.floor(total / recipients);

  return (
    <div className="rounded-2xl bg-cream p-6 text-center">
      <p className="font-body text-lg text-chocolate">
        If you have <span className="font-bold text-coral">{total} {itemName}</span> to share
        with <span className="font-bold text-sage">{recipients} {recipientName}</span>...
      </p>
      <p className="mt-4 font-display text-2xl font-bold text-chocolate">
        Each {recipientName.slice(0, -1)} gets{' '}
        <span className="text-coral">{perPerson} {itemName}</span>!
      </p>
    </div>
  );
}
