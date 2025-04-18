import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/services/auth-options";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const settingsSchema = z.object({
  // Brand Colours
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  
  // Localization
  language: z.enum(["en", "es", "fr", "de", "it"]),
  currency: z.enum(["GBP", "USD", "EUR"]),
  timezone: z.string(),
  
  // Additional Settings
  logoUrl: z.string().url().optional().or(z.literal("")),
  faviconUrl: z.string().url().optional().or(z.literal("")),
});

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = settingsSchema.parse(body);

    const organization = await prisma.organization.findUnique({
      where: { id: session.user.organizationId },
      include: { settings: true },
    });

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      );
    }

    const settings = await prisma.organizationSettings.upsert({
      where: {
        organizationId: organization.id,
      },
      update: validatedData,
      create: {
        organizationId: organization.id,
        ...validatedData,
      },
    });

    return NextResponse.json(settings);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Settings update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 