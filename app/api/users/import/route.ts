import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/services/auth/auth-options";
import { prisma } from "@/lib/prisma";
import { parse } from 'csv-parse/sync';
import { z } from 'zod';

const userImportSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(1, "Name is required"),
  role: z.enum(["ADMIN", "MEMBER"]).optional().default("MEMBER"),
  department: z.string().optional(),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
});

type UserImportData = z.infer<typeof userImportSchema>;

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { 
        organization: true,
        permissions: true
      }
    });

    if (!user?.organization || !user.permissions?.some(p => p.name === "ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const fileContent = await file.text();
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    const results = {
      successful: 0,
      failed: 0,
      errors: [] as string[],
    };

    for (const record of records) {
      try {
        const validatedData = userImportSchema.parse(record);
        
        await prisma.user.create({
          data: {
            ...validatedData,
            organizationId: user.organizationId!,
            // Generate a random temporary password that will need to be changed
            password: Math.random().toString(36).slice(-8),
            // Additional fields can be added here
          },
        });

        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push(
          `Failed to import ${record.email}: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("User import error:", error);
    return NextResponse.json(
      { error: "Error processing user import" },
      { status: 500 }
    );
  }
}
