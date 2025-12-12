'use client';

import { Provider } from 'react-redux';
import { store } from '@/store';
import { AudioProvider } from '@/contexts/AudioContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AudioProvider>{children}</AudioProvider>
    </Provider>
  );
}
