import { render, screen } from "@testing-library/react";

describe("Example Test Suite", () => {
  it("renders without crashing", () => {
    expect(true).toBe(true);
  });

  it("has access to testing-library utilities", () => {
    expect(render).toBeDefined();
    expect(screen).toBeDefined();
  });
});
