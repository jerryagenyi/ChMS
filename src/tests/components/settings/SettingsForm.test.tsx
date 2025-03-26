import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { render } from "@/tests/utils/test-utils";
import SettingsForm from "@/components/settings/SettingsForm";
import { Organisation, OrganisationSettings } from "@prisma/client";

const mockOrganisation: Organisation & {
  settings: OrganisationSettings | null;
} = {
  id: "1",
  name: "Test Org",
  description: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  settings: {
    id: "1",
    organisationId: "1",
    primaryColor: "#000000",
    secondaryColor: "#666666",
    backgroundColor: "#FFFFFF",
    accentColor: "#F5F5F5",
    language: "en",
    currency: "GBP",
    timezone: "Europe/London",
    logoUrl: null,
    faviconUrl: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

describe("SettingsForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all form elements", () => {
    render(<SettingsForm organisation={mockOrganisation} />);

    // Brand Colors
    expect(screen.getByTestId("primary-color-input")).toBeInTheDocument();
    expect(screen.getByTestId("secondary-color-input")).toBeInTheDocument();
    expect(screen.getByTestId("background-color-input")).toBeInTheDocument();
    expect(screen.getByTestId("accent-color-input")).toBeInTheDocument();

    // Localization
    expect(screen.getByTestId("language-select")).toBeInTheDocument();
    expect(screen.getByTestId("currency-select")).toBeInTheDocument();
    expect(screen.getByTestId("timezone-select")).toBeInTheDocument();

    // Brand Assets
    expect(screen.getByTestId("logo-url-input")).toBeInTheDocument();
    expect(screen.getByTestId("favicon-url-input")).toBeInTheDocument();

    // Submit Button
    expect(screen.getByTestId("save-settings-button")).toBeInTheDocument();
  });

  it("loads existing settings", () => {
    render(<SettingsForm organisation={mockOrganisation} />);

    const primaryColorInput = screen.getByTestId(
      "primary-color-input"
    ) as HTMLInputElement;
    const languageSelect = screen.getByTestId(
      "language-select"
    ) as HTMLSelectElement;
    const currencySelect = screen.getByTestId(
      "currency-select"
    ) as HTMLSelectElement;

    expect(primaryColorInput.value).toBe("#000000");
    expect(languageSelect.value).toBe("en");
    expect(currencySelect.value).toBe("GBP");
  });

  it("handles form submission", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockOrganisation.settings),
    });

    global.fetch = mockFetch;

    render(<SettingsForm organisation={mockOrganisation} />);

    // Update some values
    const primaryColorInput = screen.getByTestId(
      "primary-color-input"
    ) as HTMLInputElement;
    fireEvent.change(primaryColorInput, { target: { value: "#FF0000" } });

    // Submit the form
    const submitButton = screen.getByTestId("save-settings-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: expect.stringContaining('"primaryColor":"#FF0000"'),
      });
    });
  });

  it("handles validation errors", async () => {
    render(<SettingsForm organisation={mockOrganisation} />);

    // Try to submit with invalid color
    const primaryColorInput = screen.getByTestId(
      "primary-color-input"
    ) as HTMLInputElement;
    fireEvent.change(primaryColorInput, { target: { value: "invalid" } });

    const submitButton = screen.getByTestId("save-settings-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Invalid hex color")).toBeInTheDocument();
    });
  });

  it("handles API errors", async () => {
    const mockFetch = jest.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({ error: "Failed to update settings" }),
    });

    global.fetch = mockFetch;

    render(<SettingsForm organisation={mockOrganisation} />);

    const submitButton = screen.getByTestId("save-settings-button");
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText("Failed to update settings")).toBeInTheDocument();
    });
  });
});
