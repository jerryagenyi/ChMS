import { screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "@/tests/utils/test-utils";
import CheckInForm from "@/components/attendance/CheckInForm";

describe("CheckInForm Component", () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders form elements", () => {
    render(<CheckInForm onSubmit={mockOnSubmit} />);

    expect(screen.getByTestId("check-in-form")).toBeInTheDocument();
    expect(screen.getByTestId("member-select")).toBeInTheDocument();
    expect(screen.getByTestId("service-select")).toBeInTheDocument();
    expect(screen.getByTestId("submit-button")).toBeInTheDocument();
  });

  it("handles form submission", async () => {
    render(<CheckInForm onSubmit={mockOnSubmit} />);

    const memberSelect = screen.getByTestId("member-select");
    const serviceSelect = screen.getByTestId("service-select");
    const submitButton = screen.getByTestId("submit-button");

    fireEvent.change(memberSelect, { target: { value: "1" } });
    fireEvent.change(serviceSelect, { target: { value: "1" } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        memberId: "1",
        serviceId: "1",
      });
    });
  });

  it("disables submit button when form is invalid", () => {
    render(<CheckInForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).toBeDisabled();
  });

  it("enables submit button when form is valid", () => {
    render(<CheckInForm onSubmit={mockOnSubmit} />);

    const memberSelect = screen.getByTestId("member-select");
    const serviceSelect = screen.getByTestId("service-select");

    fireEvent.change(memberSelect, { target: { value: "1" } });
    fireEvent.change(serviceSelect, { target: { value: "1" } });

    const submitButton = screen.getByTestId("submit-button");
    expect(submitButton).not.toBeDisabled();
  });
});
