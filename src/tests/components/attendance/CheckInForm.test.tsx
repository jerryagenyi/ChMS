import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import CheckInForm from '@/components/attendance/CheckInForm';

const renderWithChakra = (component: React.ReactElement) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('CheckInForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockMembers = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Doe' }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form with member selection', () => {
    renderWithChakra(
      <CheckInForm 
        members={mockMembers}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByLabelText(/select member/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /check in/i })).toBeInTheDocument();
  });

  it('handles single member check-in', async () => {
    renderWithChakra(
      <CheckInForm 
        members={mockMembers}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.change(screen.getByLabelText(/select member/i), {
      target: { value: '1' }
    });

    fireEvent.click(screen.getByRole('button', { name: /check in/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        memberId: '1',
        type: 'INDIVIDUAL'
      });
    });
  });

  it('handles family check-in', async () => {
    renderWithChakra(
      <CheckInForm 
        members={mockMembers}
        onSubmit={mockOnSubmit}
      />
    );

    fireEvent.click(screen.getByLabelText(/family check-in/i));
    
    // Select multiple family members
    fireEvent.click(screen.getByText('John Doe'));
    fireEvent.click(screen.getByText('Jane Doe'));

    fireEvent.click(screen.getByRole('button', { name: /check in family/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        memberIds: ['1', '2'],
        type: 'FAMILY'
      });
    });
  });
});