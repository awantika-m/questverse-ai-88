import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '@/test/test-utils';
import { ChatSystem } from '@/components/ChatSystem';

describe('ChatSystem', () => {
  it('renders without crashing', () => {
    renderWithProviders(<ChatSystem />);
    expect(screen.getByText('Chat')).toBeInTheDocument();
  });

  it('opens chat sheet when clicked', async () => {
    renderWithProviders(<ChatSystem />);
    const button = screen.getByText('Chat');
    await userEvent.click(button);
    expect(screen.getByText('Chats')).toBeInTheDocument();
  });

  it('shows empty state when no chat is selected', async () => {
    renderWithProviders(<ChatSystem />);
    const button = screen.getByText('Chat');
    await userEvent.click(button);
    expect(screen.getByText('Select a chat to start messaging')).toBeInTheDocument();
  });
});