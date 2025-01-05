import { render, screen } from '@testing-library/react';
import { Dashboard } from '../Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi } from 'vitest';
import { describe, it, expect, beforeEach } from 'vitest';

// Mock dos hooks
vi.mock('../hooks/useUserMetrics', () => ({
  useUserMetrics: () => ({
    data: {
      totalUsers: 100,
      activeUsers: 80,
      inactiveUsers: 20,
      previousPeriod: {
        totalUsers: 90,
        activeUsers: 70
      }
    }
  })
}));

vi.mock('../hooks/useAdMetrics', () => ({
  useAdMetrics: () => ({
    data: {
      current: {
        total: 50,
        pending: 10,
        approved: 35,
        rejected: 5,
        approvalRate: 70
      },
      previous: {
        approvalRate: 65,
        pending: 15
      }
    }
  })
}));

describe('Dashboard', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient();
  });

  it('renders dashboard components correctly', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );

    // Verificar se os componentes principais estão presentes
    expect(screen.getByText(/Total de Usuários/i)).toBeInTheDocument();
    expect(screen.getByText(/Usuários Ativos/i)).toBeInTheDocument();
    expect(screen.getByText(/Taxa de Aprovação/i)).toBeInTheDocument();
  });

  it('displays correct metrics', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Dashboard />
      </QueryClientProvider>
    );

    // Verificar se os números estão corretos
    expect(screen.getByText('100')).toBeInTheDocument(); // Total Users
    expect(screen.getByText('80')).toBeInTheDocument(); // Active Users
    expect(screen.getByText('70.0%')).toBeInTheDocument(); // Approval Rate
  });
});