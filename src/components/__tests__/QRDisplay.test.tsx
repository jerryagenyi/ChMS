import { render, screen, waitFor } from "@testing-library/react";
import QRDisplay from "../attendance/QRDisplay";
import { generateQRCode } from "@/lib/attendance/qr";

// Mock the QR code generation function
jest.mock("@/lib/attendance/qr", () => ({
  generateQRCode: jest.fn(),
}));

describe("QRDisplay", () => {
  const mockQrUrl = "data:image/png;base64,mockQrCode";
  const testData = "test-data";

  beforeEach(() => {
    jest.clearAllMocks();
    (generateQRCode as jest.Mock).mockResolvedValue(mockQrUrl);
  });

  it("shows loading spinner initially", () => {
    render(<QRDisplay data={testData} />);
    expect(screen.getByTestId("qr-loading")).toBeInTheDocument();
  });

  it("displays QR code after generation", async () => {
    render(<QRDisplay data={testData} />);

    await waitFor(() => {
      expect(screen.getByTestId("qr-image")).toBeInTheDocument();
    });

    const qrImage = screen.getByTestId("qr-image");
    expect(qrImage).toHaveAttribute("src", mockQrUrl);
    expect(qrImage).toHaveAttribute("alt", "QR Code");
  });

  it("handles QR code generation error", async () => {
    const consoleError = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});
    (generateQRCode as jest.Mock).mockRejectedValue(
      new Error("Generation failed")
    );

    render(<QRDisplay data={testData} />);

    await waitFor(() => {
      expect(consoleError).toHaveBeenCalledWith(
        "Failed to generate QR code:",
        expect.any(Error)
      );
    });

    consoleError.mockRestore();
  });

  it("respects custom size prop", async () => {
    const customSize = 400;
    render(<QRDisplay data={testData} size={customSize} />);

    await waitFor(() => {
      const qrImage = screen.getByTestId("qr-image");
      expect(qrImage).toHaveAttribute("width", customSize.toString());
      expect(qrImage).toHaveAttribute("height", customSize.toString());
    });
  });
});
