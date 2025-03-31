import { render, screen } from '@testing-library/react';
import { UnitList } from '@/components/ministry/UnitList';

describe('UnitList', () => {
  const mockUnits = [
    { id: '1', name: 'Unit 1', leader: 'John Doe' },
    { id: '2', name: 'Unit 2', leader: 'Jane Smith' }
  ];

  it('renders list of ministry units', () => {
    render(<UnitList units={mockUnits} />);
    
    expect(screen.getByText('Unit 1')).toBeInTheDocument();
    expect(screen.getByText('Unit 2')).toBeInTheDocument();
  });
});