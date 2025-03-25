import { render, screen } from "@testing-library/react";
import QRScanner from "../attendance/QRScanner";
import { Html5QrcodeScanner } from "html5-qrcode";

// Mock html5-qrcode
jest.mock("html5-qrcode", () => ({
  Html5QrcodeScanner: jest.fn().mockImplementation(() => ({
    render: jest.fn(),
    clear: jest.fn(),
  })),
}));

describe("QRScanner", () => {
  const mockOnScan = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("initializes the scanner with correct parameters", () => {
    render(<QRScanner onScan={mockOnScan} onError={mockOnError} />);

    expect(Html5QrcodeScanner).toHaveBeenCalledWith(
      "qr-reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      false
    );
  });

  it("renders the scanner container", () => {
    render(<QRScanner onScan={mockOnScan} onError={mockOnError} />);
    const container = screen.getByTestId("qr-reader");
    expect(container).toBeInTheDocument();
  });

  it("cleans up scanner on unmount", () => {
    const { unmount } = render(
      <QRScanner onScan={mockOnScan} onError={mockOnError} />
    );

    const mockScanner = (Html5QrcodeScanner as jest.Mock).mock.results[0].value;
    unmount();

    expect(mockScanner.clear).toHaveBeenCalled();
  });
});
