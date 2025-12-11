'use client';

interface TimelineStep {
  label: string;
  description?: string;
}

interface TimelineProps {
  steps: TimelineStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
}

export function Timeline({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
}: TimelineProps) {
  if (orientation === 'vertical') {
    return (
      <div className="flex flex-col gap-2">
        {steps.map((step, i) => {
          const isCompleted = i < currentStep;
          const isCurrent = i === currentStep;
          const isClickable = onStepClick !== undefined;

          return (
            <div
              key={`step-${i}`}
              className={`flex items-start gap-3 ${isClickable ? 'cursor-pointer' : ''}`}
              onClick={() => isClickable && onStepClick(i)}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-8 w-8 items-center justify-center rounded-full
                    font-display font-bold transition-all duration-200
                    ${
                      isCompleted
                        ? 'bg-sage text-cream'
                        : isCurrent
                          ? 'bg-coral text-cream scale-110'
                          : 'bg-chocolate/10 text-chocolate/40'
                    }
                  `}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div
                    className={`
                      h-8 w-0.5 transition-all duration-200
                      ${isCompleted ? 'bg-sage' : 'bg-chocolate/10'}
                    `}
                  />
                )}
              </div>
              <div className="pt-1">
                <p
                  className={`
                    font-display font-semibold
                    ${isCurrent ? 'text-coral' : isCompleted ? 'text-sage' : 'text-chocolate/60'}
                  `}
                >
                  {step.label}
                </p>
                {step.description && (
                  <p className="mt-0.5 font-body text-sm text-chocolate/60">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal timeline
  return (
    <div className="flex items-center justify-center gap-1">
      {steps.map((step, i) => {
        const isCompleted = i < currentStep;
        const isCurrent = i === currentStep;
        const isClickable = onStepClick !== undefined;

        return (
          <div key={`step-${i}`} className="flex items-center">
            <div
              className={`
                flex flex-col items-center
                ${isClickable ? 'cursor-pointer' : ''}
              `}
              onClick={() => isClickable && onStepClick(i)}
            >
              <div
                className={`
                  flex h-10 w-10 items-center justify-center rounded-full
                  font-display font-bold transition-all duration-200
                  ${
                    isCompleted
                      ? 'bg-sage text-cream'
                      : isCurrent
                        ? 'bg-coral text-cream scale-110'
                        : 'bg-chocolate/10 text-chocolate/40'
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`
                  mt-1 text-center font-body text-xs
                  ${isCurrent ? 'text-coral font-semibold' : 'text-chocolate/60'}
                `}
              >
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`
                  mx-1 h-0.5 w-8 transition-all duration-200
                  ${isCompleted ? 'bg-sage' : 'bg-chocolate/10'}
                `}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
