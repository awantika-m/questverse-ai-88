import React, { PropsWithChildren } from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { TooltipProvider } from '@/components/ui/tooltip';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

export function renderWithProviders(
  ui: React.ReactElement,
  { route = '/' } = {}
) {
  window.history.pushState({}, 'Test page', route);

  return {
    ...render(ui, {
      wrapper: ({ children }: PropsWithChildren) => (
        <QueryClientProvider client={queryClient}>
          <NotificationProvider>
            <TooltipProvider>
              <BrowserRouter>
                {children}
              </BrowserRouter>
            </TooltipProvider>
          </NotificationProvider>
        </QueryClientProvider>
      ),
    }),
  };
}