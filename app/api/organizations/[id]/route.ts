import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

// Get specific organization
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const organization = await prisma.organization.findFirst({
      where: {
        id: params.id,
        users: {
          some: {
            email: session.user.email
          }
        }
      },
      include: {
        departments: true,
        teams: true,
      }
    })

    if (!organization) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(organization)
  } catch (error) {
    console.error("Error fetching organization:", error)
    return NextResponse.json(
      { error: "Error fetching organization" },
      { status: 500 }
    )
  }
}

// Update organization
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // Check if user is admin of this organization
    const user = await prisma.user.findFirst({
      where: {
        email: session.user.email,
        organizationId: params.id,
        role: "ADMIN"
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name, description } = await req.json()
    const updatedOrg = await prisma.organization.update({
      where: { id: params.id },
      data: {
        name,
        description,
      }
    })

    return NextResponse.json(updatedOrg)
  } catch (error) {
    console.error("Error updating organization:", error)
    return NextResponse.json(
      { error: "Error updating organization" },
      { status: 500 }
    )
  }
}