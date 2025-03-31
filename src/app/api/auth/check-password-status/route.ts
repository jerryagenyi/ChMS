import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/services/auth/auth-options";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ needsPassword: false });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { password: true },
    });

    return NextResponse.json({ needsPassword: !user?.password });
  } catch (error) {
    console.error("Error checking password status:", error);
    return NextResponse.json({ needsPassword: false });
  }
}