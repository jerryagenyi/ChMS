import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/services/auth';
import { rateLimit } from '@/lib/rate-limit';
import { validateApiKey } from '@/lib/api-key';

const exportParamsSchema = z.object({
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  format: z.enum(['json', 'csv', 'excel']),
  includeMetadata: z.boolean().default(true),
  fields: z.array(z.string()).optional(),
});

export async function GET(req: Request) {
  try {
    // Check authentication (either session or API key)
    const session = await getServerSession(authOptions);
    const apiKey = req.headers.get('x-api-key');
    
    if (!session?.user && !apiKey) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Validate API key if present
    if (apiKey) {
      const isValidKey = await validateApiKey(apiKey);
      if (!isValidKey) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
      }
    }

    // Apply rate limiting
    const rateLimitResult = await rateLimit.check(req);
    if (!rateLimitResult.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    // Parse and validate query parameters
    const { searchParams } = new URL(req.url);
    const params = exportParamsSchema.parse({
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      format: searchParams.get('format'),
      includeMetadata: searchParams.get('includeMetadata') === 'true',
      fields: searchParams.get('fields')?.split(','),
    });

    // Fetch attendance data
    const attendanceData = await prisma.attendance.findMany({
      where: {
        date: {
          gte: new Date(params.startDate),
          lte: new Date(params.endDate),
        },
      },
      include: {
        member: params.includeMetadata,
        service: params.includeMetadata,
      },
    });

    // Transform data based on format
    const formattedData = await formatExportData(attendanceData, params.format, params.fields);

    // Set appropriate headers
    const headers = new Headers();
    headers.set('Content-Type', getContentType(params.format));
    headers.set('Content-Disposition', `attachment; filename=attendance-export.${params.format}`);

    return new NextResponse(formattedData, { headers });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Error processing export" },
      { status: 500 }
    );
  }
}