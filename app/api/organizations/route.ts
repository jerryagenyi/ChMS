import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { name, description } = await req.json()

    // Validate input
    if (!name) {
      return NextResponse.json(
        { error: "Organization name is required" },
        { status: 400 }
      )
    }

    // Start a transaction to create org and update user
    const result = await prisma.$transaction(async (tx) => {
      // Create the organization
      const organization = await tx.organisation.create({
        data: {
          name,
          description,
        },
      })

      // Update the user to be an admin of this organization
      await tx.user.update({
        where: { email: session.user.email },
        data: {
          role: "ADMIN",
          organisationId: organization.id,
        },
      })

      return organization
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Organization creation error:", error)
    return NextResponse.json(
      { error: "Error creating organization" },
      { status: 500 }
    )
  }
}

// Get organizations (for admin users)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const organizations = await prisma.organisation.findMany({
      where: {
        users: {
          some: {
            email: session.user.email,
            role: "ADMIN"
          }
        }
      }
    })

    return NextResponse.json(organizations)
  } catch (error) {
    console.error("Error fetching organizations:", error)
    return NextResponse.json(
      { error: "Error fetching organizations" },
      { status: 500 }
    )
  }
}