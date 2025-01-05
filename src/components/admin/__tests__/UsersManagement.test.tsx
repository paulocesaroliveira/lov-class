import { render, screen, fireEvent } from '@testing-library/react';
import { UsersManagement } from '../UsersManagement';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';

// Mock dos hooks
vi.mock('../hooks/useUsers', () => ({
  useUsers: () => ({
    data: {
      data: [
        {
          id: '1',
          name: 'Test User',
          role: 'user',
          created_at: '2024-01-01',
          admin_notes: []
        }
      ],
      totalCount: 1
    },
    isLoading: false
  }),
  useUserActions: () => ({
    handleRoleChange: vi.fn(),
    handleAddNote: vi.fn()
  })
}));

describe('UsersManagement', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('renders users table correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UsersManagement />
      </QueryClientProvider>
    );

    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('shows user filters', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <UsersManagement />
      </QueryClientProvider>
    );

    expect(screen.getByPlaceholderText(/Buscar/i)).toBeInTheDocument();
  });
});