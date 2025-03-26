import React from "react";
import { screen, waitFor } from "@testing-library/react";
import { render } from "@/tests/utils/test-utils";
import QRScanner from "@/components/attendance/QRScanner";

// Define mock interface
interface MockQrScannerInstance {
  start: jest.Mock;
  stop: jest.Mock;
  destroy: jest.Mock;
  options?: {
    onDecode: (result: string) => void;
    onDecodeError: (error: Error) => void;
  };
}

// Create mock class
class MockQrScanner {
  static hasCamera = jest.fn().mockResolvedValue(true);

  options?: {
    onDecode: (result: string) => void;
    onDecodeError: (error: Error) => void;
  };

  start = jest.fn().mockResolvedValue(undefined);
  stop = jest.fn();
  destroy = jest.fn();

  constructor(
    _videoElem: HTMLVideoElement,
    opts?: MockQrScannerInstance["options"]
  ) {
    this.options = opts;
  }
}

// Mock the module
jest.mock("qr-scanner", () => MockQrScanner);

describe("QRScanner Component", () => {
  const mockOnScan = jest.fn();
  const mockOnError = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders scanner viewport", () => {
    render(<QRScanner onScan={mockOnScan} onError={mockOnError} />);
    const videoElement = screen.getByTestId("qr-scanner-viewport");
    expect(videoElement).toBeInTheDocument();
    expect(videoElement.tagName).toBe("VIDEO");
  });

  it("initializes scanner when mounted", async () => {
    render(<QRScanner onScan={mockOnScan} onError={mockOnError} />);

    // The QrScanner constructor should be called
    await waitFor(() => {
      expect(MockQrScanner.prototype.start).toHaveBeenCalled();
    });
  });

  it("calls onScan when QR code is detected", async () => {
    // Get the constructor arguments to access callbacks
    let instance: MockQrScannerInstance | null = null;

    // Override the constructor for this test
    const originalMockQrScanner = jest.requireMock("qr-scanner");
    jest.resetModules();
    jest.doMock("qr-scanner", () => {
      return jest.fn().mockImplementation((_videoElem, _opts) => {
        instance = new MockQrScanner(_videoElem, _opts);
        return instance;
      });
    });

    // Re-import after mock change
    const { default: ReimportedQRScanner } = await import(
      "@/components/attendance/QRScanner"
    );

    render(<ReimportedQRScanner onScan={mockOnScan} onError={mockOnError} />);

    await waitFor(() => {
      expect(instance).not.toBeNull();
    });

    // Simulate a scan (safely)
    if (instance?.options?.onDecode) {
      instance.options.onDecode("test-qr-data");
      expect(mockOnScan).toHaveBeenCalledWith("test-qr-data");
    }

    // Restore the original mock
    jest.doMock("qr-scanner", () => originalMockQrScanner);
  });

  it("cleans up scanner on unmount", async () => {
    // Create a specific mock instance for this test
    const mockInstance = new MockQrScanner(document.createElement("video"));

    // Mock the constructor to return our instance
    const QrScannerMock = jest.requireMock("qr-scanner");
    QrScannerMock.mockImplementation(() => mockInstance);

    const { unmount } = render(
      <QRScanner onScan={mockOnScan} onError={mockOnError} />
    );

    // Wait for scanner to be initialized
    await waitFor(() => {
      expect(mockInstance.start).toHaveBeenCalled();
    });

    // Unmount and check cleanup
    unmount();

    expect(mockInstance.stop).toHaveBeenCalled();
    expect(mockInstance.destroy).toHaveBeenCalled();
  });
});
