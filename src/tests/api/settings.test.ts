import { createMocks } from "node-mocks-http";
import { PUT } from "@/app/api/settings/route";
import { prismaMock } from "@/tests/mocks/prisma";
import { getServerSession } from "next-auth";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

describe("Settings API", () => {
  const mockSession = {
    user: {
      id: "1",
      email: "test@example.com",
      organisationId: "org1",
    },
  };

  const mockOrganisation = {
    id: "org1",
    name: "Test Org",
    settings: {
      id: "1",
      organisationId: "org1",
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

  beforeEach(() => {
    jest.clearAllMocks();
    (getServerSession as jest.Mock).mockResolvedValue(mockSession);
  });

  it("handles unauthorized access", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const { req } = createMocks({
      method: "PUT",
      body: {},
    });

    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe("Unauthorized");
  });

  it("handles invalid data", async () => {
    const { req } = createMocks({
      method: "PUT",
      body: {
        primaryColor: "invalid",
        secondaryColor: "#666666",
        backgroundColor: "#FFFFFF",
        accentColor: "#F5F5F5",
        language: "en",
        currency: "GBP",
        timezone: "Europe/London",
      },
    });

    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Invalid data");
    expect(data.details).toBeDefined();
  });

  it("creates new settings", async () => {
    prismaMock.organisation.findUnique.mockResolvedValue(mockOrganisation);
    prismaMock.organisationSettings.upsert.mockResolvedValue(mockOrganisation.settings);

    const { req } = createMocks({
      method: "PUT",
      body: {
        primaryColor: "#FF0000",
        secondaryColor: "#666666",
        backgroundColor: "#FFFFFF",
        accentColor: "#F5F5F5",
        language: "en",
        currency: "GBP",
        timezone: "Europe/London",
      },
    });

    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual(mockOrganisation.settings);
    expect(prismaMock.organisationSettings.upsert).toHaveBeenCalledWith({
      where: { organisationId: "org1" },
      create: expect.any(Object),
      update: expect.any(Object),
    });
  });

  it("handles organisation not found", async () => {
    prismaMock.organisation.findUnique.mockResolvedValue(null);

    const { req } = createMocks({
      method: "PUT",
      body: {
        primaryColor: "#FF0000",
        secondaryColor: "#666666",
        backgroundColor: "#FFFFFF",
        accentColor: "#F5F5F5",
        language: "en",
        currency: "GBP",
        timezone: "Europe/London",
      },
    });

    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Organisation not found");
  });

  it("handles server errors", async () => {
    prismaMock.organisation.findUnique.mockRejectedValue(new Error("Database error"));

    const { req } = createMocks({
      method: "PUT",
      body: {
        primaryColor: "#FF0000",
        secondaryColor: "#666666",
        backgroundColor: "#FFFFFF",
        accentColor: "#F5F5F5",
        language: "en",
        currency: "GBP",
        timezone: "Europe/London",
      },
    });

    const response = await PUT(req);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal server error");
  });
}); 