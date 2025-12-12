'use client';

import { StepIcon, labelToIconType } from '@/components/common/StepIcon';
import { useAudio } from '@/hooks/useAudio';

interface TimelineStep {
  label: string;
  description?: string;
  narration?: string;
}

interface TimelineProps {
  steps: TimelineStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  orientation?: 'horizontal' | 'vertical';
  showLabels?: boolean;
}

export function Timeline({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  showLabels = false,
}: TimelineProps) {
  const { speak, playSound } = useAudio();

  const handleStepClick = (index: number) => {
    if (onStepClick) {
      playSound('click');
      const step = steps[index];
      if (step.narration) {
        speak(step.narration);
      } else if (step.description) {
        speak(step.description);
      }
      onStepClick(index);
    }
  };
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
              className={`flex items-start gap-3 ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}`}
              onClick={() => handleStepClick(i)}
            >
              <div className="flex flex-col items-center">
                <div
                  className={`
                    flex h-10 w-10 items-center justify-center rounded-full
                    transition-all duration-200
                    ${
                      isCompleted
                        ? 'bg-sage text-cream'
                        : isCurrent
                          ? 'bg-coral text-cream scale-110 animate-pulse'
                          : 'bg-chocolate/10 text-chocolate/40'
                    }
                  `}
                >
                  {isCompleted ? (
                    <StepIcon type="done" size="md" />
                  ) : (
                    <StepIcon type={labelToIconType(step.label)} size="md" />
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
              {showLabels && (
                <div className="pt-2">
                  <p
                    className={`
                      font-display font-semibold
                      ${isCurrent ? 'text-coral' : isCompleted ? 'text-sage' : 'text-chocolate/60'}
                    `}
                  >
                    {step.label}
                  </p>
                </div>
              )}
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
                ${isClickable ? 'cursor-pointer hover:opacity-80' : ''}
              `}
              onClick={() => handleStepClick(i)}
            >
              <div
                className={`
                  flex h-12 w-12 items-center justify-center rounded-full
                  transition-all duration-200
                  ${
                    isCompleted
                      ? 'bg-sage text-cream'
                      : isCurrent
                        ? 'bg-coral text-cream scale-110 animate-pulse'
                        : 'bg-chocolate/10 text-chocolate/40'
                  }
                `}
              >
                {isCompleted ? (
                  <StepIcon type="done" size="lg" />
                ) : (
                  <StepIcon type={labelToIconType(step.label)} size="lg" />
                )}
              </div>
              {showLabels && (
                <span
                  className={`
                    mt-1 text-center font-body text-xs
                    ${isCurrent ? 'text-coral font-semibold' : 'text-chocolate/60'}
                  `}
                >
                  {step.label}
                </span>
              )}
            </div>
            {i < steps.length - 1 && (
              <div
                className={`
                  mx-1 h-0.5 w-6 transition-all duration-200
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
