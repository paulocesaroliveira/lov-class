import { render, screen, fireEvent } from '@testing-library/react';
import { AdsTable } from '../AdsTable';
import { describe, it, expect, vi } from 'vitest';

describe('AdsTable Component', () => {
  const mockAdvertisements = [
    {
      id: '1',
      name: 'Test Ad',
      profiles: { name: 'Test User' },
      category: 'test',
      advertisement_reviews: [{ status: 'pending' }],
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      blocked: false,
    },
  ];

  const mockHandlers = {
    onDelete: vi.fn(),
    onBlock: vi.fn(),
    onView: vi.fn(),
    onApprove: vi.fn(),
    onReview: vi.fn(),
  };

  it('renders the table with correct headers', () => {
    render(
      <AdsTable
        advertisements={mockAdvertisements}
        deleting={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Título')).toBeInTheDocument();
    expect(screen.getByText('Anunciante')).toBeInTheDocument();
    expect(screen.getByText('Categoria')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('renders advertisement data correctly', () => {
    render(
      <AdsTable
        advertisements={mockAdvertisements}
        deleting={null}
        {...mockHandlers}
      />
    );

    expect(screen.getByText('Test Ad')).toBeInTheDocument();
    expect(screen.getByText('Test User')).toBeInTheDocument();
    expect(screen.getByText('test')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <AdsTable
        advertisements={mockAdvertisements}
        deleting={null}
        {...mockHandlers}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    expect(mockHandlers.onDelete).toHaveBeenCalledWith('1');
  });

  it('disables delete button when deleting', () => {
    render(
      <AdsTable
        advertisements={mockAdvertisements}
        deleting="1"
        {...mockHandlers}
      />
    );

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    expect(deleteButton).toBeDisabled();
  });
});