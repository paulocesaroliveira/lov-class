import { render, screen, fireEvent } from '@testing-library/react';
import { AdsManagement } from '../AdsManagement';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';

// Mock dos hooks
vi.mock('../ads/hooks/useAdvertisements', () => ({
  useAdvertisements: () => ({
    data: [
      {
        id: '1',
        name: 'Test Ad',
        profiles: { name: 'Test User' },
        category: 'test',
        advertisement_reviews: [{ status: 'pending' }],
        created_at: '2024-01-01',
        updated_at: '2024-01-01'
      }
    ],
    refetch: vi.fn()
  })
}));

describe('AdsManagement', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('renders ads table correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AdsManagement />
      </QueryClientProvider>
    );

    expect(screen.getByText('Test Ad')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('shows action buttons', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <AdsManagement />
      </QueryClientProvider>
    );

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });
});