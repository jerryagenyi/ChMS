import { authOptions } from "@/services/auth/auth-options";
import { getServerSession } from "next-auth/next";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

    // User needs a password if they don't have one set
    return NextResponse.json({ needsPassword: !user?.password });
  } catch (error) {
    console.error("Error checking password status:", error);
    return NextResponse.json({ needsPassword: false });
  }
}
