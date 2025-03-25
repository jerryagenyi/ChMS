import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { nanoid } from 'nanoid'

// Generate invitation
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organisation: true }
    })

    if (!user?.organisation || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { email, role = "MEMBER" } = await req.json()

    const invitation = await prisma.invitation.create({
      data: {
        code: nanoid(8), // Generate 8-character unique code
        email,
        role,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        organisationId: user.organisationId!
      }
    })

    return NextResponse.json(invitation, { status: 201 })
  } catch (error) {
    console.error("Error creating invitation:", error)
    return NextResponse.json(
      { error: "Failed to create invitation" },
      { status: 500 }
    )
  }
}

// List invitations
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: { organisation: true }
    })

    if (!user?.organisation || user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const invitations = await prisma.invitation.findMany({
      where: { 
        organisationId: user.organisationId,
        used: false,
        expires: { gt: new Date() }
      }
    })

    return NextResponse.json(invitations)
  } catch (error) {
    console.error("Error listing invitations:", error)
    return NextResponse.json(
      { error: "Failed to list invitations" },
      { status: 500 }
    )
  }
}