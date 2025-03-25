import { render, screen, fireEvent } from "@testing-library/react";
import PasswordSetup from "../PasswordSetup";
import { SessionProvider } from "next-auth/react";

describe("PasswordSetup Component", () => {
  it("renders without crashing", () => {
    render(
      <SessionProvider session={null}>
        <PasswordSetup />
      </SessionProvider>
    );
  });

  it("does not show the component if no session", () => {
    render(
      <SessionProvider session={null}>
        <PasswordSetup />
      </SessionProvider>
    );
    expect(screen.queryByText(/Want a backup login option?/i)).toBeNull();
  });

  it("shows the component if session exists and needs password", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ needsPassword: true }),
      })
    ) as jest.Mock;

    render(
      <SessionProvider session={{ user: { name: "Test User" } }}>
        <PasswordSetup />
      </SessionProvider>
    );

    expect(
      await screen.findByText(/Want a backup login option?/i)
    ).toBeInTheDocument();
  });

  it("handles password setup", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
      })
    ) as jest.Mock;

    render(
      <SessionProvider session={{ user: { name: "Test User" } }}>
        <PasswordSetup />
      </SessionProvider>
    );

    fireEvent.click(
      screen.getByRole("button", { name: /Set backup password/i })
    );
    fireEvent.change(screen.getByPlaceholderText(/Enter new password/i), {
      target: { value: "newpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Set/i }));

    expect(
      await screen.findByText(/Password set successfully!/i)
    ).toBeInTheDocument();
  });
});
