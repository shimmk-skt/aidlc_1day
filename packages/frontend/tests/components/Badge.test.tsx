import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Badge from '../../src/components/Badge';

describe('Badge', () => {
  it('renders status label', () => {
    render(<Badge status="PENDING" />);
    expect(screen.getByText('결제 대기')).toBeInTheDocument();
  });

  it('renders delivered status', () => {
    render(<Badge status="DELIVERED" />);
    expect(screen.getByText('배송 완료')).toBeInTheDocument();
  });
});
