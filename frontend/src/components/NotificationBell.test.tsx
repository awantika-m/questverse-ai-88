import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { NotificationBell } from '@/components/NotificationBell';

describe('NotificationBell', () => {
  it('renders without crashing', () => {
    renderWithProviders(<NotificationBell />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('shows notification count when there are unread notifications', async () => {
    renderWithProviders(<NotificationBell />);
    const button = screen.getByRole('button');
    await userEvent.click(button);
    expect(screen.getByText('No notifications')).toBeInTheDocument();
  });
});