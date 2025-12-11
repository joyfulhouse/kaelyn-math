'use client';

import { Component, type ReactNode } from 'react';
import { Button } from './Button';
import { Card, CardContent, CardTitle } from './Card';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component to catch and handle React errors gracefully.
 * Shows a friendly error message instead of crashing the whole app.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error for debugging (in production, send to error tracking service)
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card variant="elevated" className="mx-auto max-w-md">
          <CardTitle className="text-coral">Oops! Something went wrong</CardTitle>
          <CardContent>
            <div className="flex flex-col items-center gap-4 text-center">
              <p className="font-body text-chocolate/70">
                Don&apos;t worry! Let&apos;s try again.
              </p>
              <div className="text-6xl">
                <span role="img" aria-label="thinking face">🤔</span>
              </div>
              <Button onClick={this.handleRetry}>
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
