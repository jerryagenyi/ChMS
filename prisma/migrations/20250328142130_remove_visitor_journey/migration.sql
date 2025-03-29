/*
  Warnings:

  - You are about to drop the `VisitorJourney` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VisitorJourney" DROP CONSTRAINT "VisitorJourney_visitorId_fkey";

-- DropTable
DROP TABLE "VisitorJourney";
