import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
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

    const organisation = await prisma.organisation.findUnique({
      where: { id: session.user.organisationId },
      include: { settings: true },
    });

    if (!organisation) {
      return NextResponse.json(
        { error: "Organisation not found" },
        { status: 404 }
      );
    }

    const settings = await prisma.organisationSettings.upsert({
      where: {
        organisationId: organisation.id,
      },
      update: validatedData,
      create: {
        organisationId: organisation.id,
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