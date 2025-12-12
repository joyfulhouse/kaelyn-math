'use client';

import { useState } from 'react';
import { NumberLine } from './NumberLine';
import { CountingBlocks } from './CountingBlocks';
import type { ProblemType } from '@/types';

type Tool = 'numberline' | 'blocks' | 'fingers' | null;

interface MathToolboxProps {
  num1: number;
  num2: number;
  operation: ProblemType;
  onToolUse?: (tool: Tool) => void;
}

// Finger counting display
function FingerCounter({ count, max = 10 }: { count: number; max?: number }) {
  const displayCount = Math.min(count, max);
  const leftHand = Math.min(displayCount, 5);
  const rightHand = Math.max(0, displayCount - 5);

  const renderHand = (fingers: number, isLeft: boolean) => (
    <div className={`flex ${isLeft ? 'flex-row-reverse' : 'flex-row'} gap-1`}>
      {/* Thumb */}
      <div
        className={`
          w-4 h-8 rounded-full transition-all duration-200
          ${fingers > 0 ? 'bg-yellow' : 'bg-chocolate/10'}
          ${isLeft ? '-rotate-45' : 'rotate-45'}
          transform origin-bottom
        `}
      />
      {/* Fingers */}
      {[1, 2, 3, 4].map((f) => (
        <div
          key={f}
          className={`
            w-3 rounded-full transition-all duration-200
            ${f < fingers ? 'h-10 bg-yellow' : 'h-6 bg-chocolate/10'}
          `}
        />
      ))}
    </div>
  );

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-8 items-end">
        {/* Left hand */}
        <div className="flex flex-col items-center gap-2">
          {renderHand(leftHand, true)}
          <div className="w-8 h-4 rounded-t-lg bg-yellow/60" />
        </div>
        {/* Right hand */}
        <div className="flex flex-col items-center gap-2">
          {renderHand(rightHand, false)}
          <div className="w-8 h-4 rounded-t-lg bg-yellow/60" />
        </div>
      </div>
      <div className="font-display text-2xl font-bold text-chocolate">
        {displayCount}
      </div>
      {count > 10 && (
        <p className="text-sm text-chocolate-muted">
          (Showing 10, total is {count})
        </p>
      )}
    </div>
  );
}

// Tool button component
function ToolButton({
  isActive,
  onClick,
  icon,
  label,
}: {
  isActive: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col items-center gap-1 rounded-xl p-3 transition-all
        ${isActive
          ? 'bg-sky text-cream scale-105 shadow-soft'
          : 'bg-cream text-chocolate/60 hover:bg-sky/10 hover:text-chocolate'
        }
      `}
      aria-label={label}
      aria-pressed={isActive}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

export function MathToolbox({ num1, num2, operation, onToolUse }: MathToolboxProps) {
  const [activeTool, setActiveTool] = useState<Tool>(null);

  const handleToolClick = (tool: Tool) => {
    const newTool = activeTool === tool ? null : tool;
    setActiveTool(newTool);
    onToolUse?.(newTool);
  };

  // Map problem type to operation for tools
  const getToolOperation = () => {
    switch (operation) {
      case 'addition': return 'add' as const;
      case 'subtraction': return 'subtract' as const;
      case 'multiplication': return 'multiply' as const;
      case 'division': return 'divide' as const;
      default: return null;
    }
  };

  // Determine which tools are useful for this operation
  const isUseful = {
    numberline: operation === 'addition' || operation === 'subtraction',
    blocks: true, // All operations can use blocks
    fingers: (operation === 'addition' || operation === 'subtraction') && num1 <= 10 && num2 <= 10,
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbox header */}
      <div className="flex items-center gap-2">
        <svg className="h-5 w-5 text-chocolate/60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M22.7 19l-9.1-9.1c.9-2.3.4-5-1.5-6.9-2-2-5-2.4-7.4-1.3L9 6 6 9 1.6 4.7C.4 7.1.9 10.1 2.9 12.1c1.9 1.9 4.6 2.4 6.9 1.5l9.1 9.1c.4.4 1 .4 1.4 0l2.3-2.3c.5-.4.5-1.1.1-1.4z"/>
        </svg>
        <span className="font-display text-sm font-medium text-chocolate">Helper Tools</span>
      </div>

      {/* Tool buttons */}
      <div className="flex flex-wrap gap-2 justify-center">
        {isUseful.numberline && (
          <ToolButton
            isActive={activeTool === 'numberline'}
            onClick={() => handleToolClick('numberline')}
            icon={
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="2" y1="12" x2="22" y2="12" />
                <line x1="6" y1="8" x2="6" y2="16" />
                <line x1="12" y1="8" x2="12" y2="16" />
                <line x1="18" y1="8" x2="18" y2="16" />
              </svg>
            }
            label="Number Line"
          />
        )}

        {isUseful.blocks && (
          <ToolButton
            isActive={activeTool === 'blocks'}
            onClick={() => handleToolClick('blocks')}
            icon={
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" opacity="0.5" />
              </svg>
            }
            label="Blocks"
          />
        )}

        {isUseful.fingers && (
          <ToolButton
            isActive={activeTool === 'fingers'}
            onClick={() => handleToolClick('fingers')}
            icon={
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C9.5 2 7.5 4 7.5 6.5V10H6c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2h-1.5V6.5C16.5 4 14.5 2 12 2zm0 2c1.4 0 2.5 1.1 2.5 2.5V10h-5V6.5C9.5 5.1 10.6 4 12 4z"/>
              </svg>
            }
            label="Fingers"
          />
        )}
      </div>

      {/* Active tool display */}
      {activeTool && (
        <div className="rounded-2xl bg-paper p-4 shadow-inner">
          {activeTool === 'numberline' && (
            <NumberLine
              min={0}
              max={Math.max(20, num1 + num2 + 5)}
              start={operation === 'subtraction' ? num1 : 0}
              operation={getToolOperation() as 'add' | 'subtract' | null}
              amount={0}
              interactive={true}
            />
          )}

          {activeTool === 'blocks' && (
            <CountingBlocks
              num1={num1}
              num2={num2}
              operation={getToolOperation()}
              interactive={true}
            />
          )}

          {activeTool === 'fingers' && (
            <div className="flex flex-col items-center gap-4">
              <p className="text-sm text-chocolate-muted">
                {operation === 'addition'
                  ? `Start with ${num1} fingers, then add ${num2} more!`
                  : `Start with ${num1} fingers, then put down ${num2}!`
                }
              </p>
              <div className="flex gap-8">
                <div className="flex flex-col items-center">
                  <span className="text-sm text-coral font-medium mb-2">{num1}</span>
                  <FingerCounter count={num1} />
                </div>
                <div className="flex items-center text-2xl text-chocolate">
                  {operation === 'addition' ? '+' : '−'}
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-sm text-sage font-medium mb-2">{num2}</span>
                  <FingerCounter count={num2} />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
