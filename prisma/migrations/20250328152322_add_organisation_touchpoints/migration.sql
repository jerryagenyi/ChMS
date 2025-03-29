/*
  Warnings:

  - Added the required column `organizationId` to the `VisitorTouchpoint` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VisitorTouchpoint" ADD COLUMN     "organizationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "OrganizationTouchpoint" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrganizationTouchpoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "OrganizationTouchpoint_organizationId_idx" ON "OrganizationTouchpoint"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationTouchpoint_organizationId_type_source_key" ON "OrganizationTouchpoint"("organizationId", "type", "source");

-- CreateIndex
CREATE INDEX "VisitorTouchpoint_organizationId_touchpoint_source_idx" ON "VisitorTouchpoint"("organizationId", "touchpoint", "source");

-- AddForeignKey
ALTER TABLE "OrganizationTouchpoint" ADD CONSTRAINT "OrganizationTouchpoint_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VisitorTouchpoint" ADD CONSTRAINT "VisitorTouchpoint_organizationId_touchpoint_source_fkey" FOREIGN KEY ("organizationId", "touchpoint", "source") REFERENCES "OrganizationTouchpoint"("organizationId", "type", "source") ON DELETE RESTRICT ON UPDATE CASCADE;
