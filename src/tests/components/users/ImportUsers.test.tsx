import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "@/tests/utils/test-utils";
import ImportUsers from "@/components/users/ImportUsers";

// Create mocks before tests
const mockFetch = jest.fn();
const mockCreateObjectURL = jest.fn().mockReturnValue("mock-url");
const mockRevokeObjectURL = jest.fn();
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();

// Mock Element setup
const mockAnchorElement = {
  href: "",
  download: "",
  click: jest.fn(),
};

// Setup before all tests
beforeAll(() => {
  // Mock fetch
  global.fetch = mockFetch;

  // Mock URL methods
  URL.createObjectURL = mockCreateObjectURL;
  URL.revokeObjectURL = mockRevokeObjectURL;

  // Mock document methods
  document.createElement = jest.fn().mockImplementation((tag) => {
    if (tag === "a") return mockAnchorElement;
    return {};
  });

  document.body.appendChild = mockAppendChild;
  document.body.removeChild = mockRemoveChild;
});

// Clean up after all tests
afterAll(() => {
  jest.restoreAllMocks();
});

describe("ImportUsers Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetch.mockReset();
    mockAnchorElement.click.mockClear();
  });

  it("renders import form with all elements", () => {
    render(<ImportUsers />);

    expect(screen.getByTestId("import-users-component")).toBeInTheDocument();
    expect(screen.getByTestId("download-template-button")).toBeInTheDocument();
    expect(screen.getByTestId("file-input")).toBeInTheDocument();
    expect(screen.getByTestId("import-button")).toBeInTheDocument();
    expect(screen.getByText("Import Users")).toBeInTheDocument();
  });

  it("handles template download", () => {
    render(<ImportUsers />);

    fireEvent.click(screen.getByTestId("download-template-button"));

    expect(document.createElement).toHaveBeenCalledWith("a");
    expect(mockAnchorElement.download).toBe("user-import-template.csv");
    expect(mockCreateObjectURL).toHaveBeenCalled();
    expect(mockAnchorElement.click).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  it("handles file selection", () => {
    render(<ImportUsers />);

    const file = new File(["test"], "test.csv", { type: "text/csv" });
    const input = screen.getByTestId("file-input") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });

    // Import button should be enabled after file selection
    const importButton = screen.getByTestId("import-button");
    expect(importButton).not.toBeDisabled();
  });

  it("handles successful import", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          successful: 2,
          failed: 0,
          errors: [],
        }),
    });

    render(<ImportUsers />);

    const file = new File(["test csv content"], "test.csv", {
      type: "text/csv",
    });
    const input = screen.getByTestId("file-input") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByTestId("import-button"));

    // Check loading state appears
    expect(screen.getByText("Uploading...")).toBeInTheDocument();

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText("Successfully imported: 2")).toBeInTheDocument();
    });

    // Check FormData was set up correctly
    expect(mockFetch).toHaveBeenCalledWith(
      "/api/users/import",
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      })
    );
  });

  it("handles import with errors", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          successful: 1,
          failed: 1,
          errors: ["Invalid email format for row 2"],
        }),
    });

    render(<ImportUsers />);

    const file = new File(["test csv content"], "test.csv", {
      type: "text/csv",
    });
    const input = screen.getByTestId("file-input") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByTestId("import-button"));

    await waitFor(() => {
      expect(screen.getByText("Successfully imported: 1")).toBeInTheDocument();
      expect(screen.getByText("Failed: 1")).toBeInTheDocument();
      expect(
        screen.getByText("Invalid email format for row 2")
      ).toBeInTheDocument();
    });
  });

  it("handles API errors", async () => {
    // Mock failed response
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: () => Promise.resolve({ error: "Network error" }),
    });

    render(<ImportUsers />);

    const file = new File(["test csv content"], "test.csv", {
      type: "text/csv",
    });
    const input = screen.getByTestId("file-input") as HTMLInputElement;

    fireEvent.change(input, { target: { files: [file] } });
    fireEvent.click(screen.getByTestId("import-button"));

    // The toast would show "Import Failed" in the UI, but toast is mocked
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });

    // No results should be shown for an error
    expect(screen.queryByText("Import Results")).not.toBeInTheDocument();
  });
});
