-- CreateTable
CREATE TABLE "VisitorTouchpoint" (
    "id" TEXT NOT NULL,
    "visitorId" TEXT NOT NULL,
    "touchpoint" TEXT NOT NULL,
    "source" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VisitorTouchpoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VisitorTouchpoint_visitorId_idx" ON "VisitorTouchpoint"("visitorId");

-- AddForeignKey
ALTER TABLE "VisitorTouchpoint" ADD CONSTRAINT "VisitorTouchpoint_visitorId_fkey" FOREIGN KEY ("visitorId") REFERENCES "Visitor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
