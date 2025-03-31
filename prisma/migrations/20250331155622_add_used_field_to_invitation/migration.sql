/*
  Warnings:

  - You are about to drop the column `backupCodes` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `imageType` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `role` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorEnabled` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactorMethod` on the `User` table. All the data in the column will be lost.
  - Made the column `password` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Invitation" ADD COLUMN     "used" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "backupCodes",
DROP COLUMN "image",
DROP COLUMN "imageType",
DROP COLUMN "role",
DROP COLUMN "twoFactorEnabled",
DROP COLUMN "twoFactorMethod",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "memorableDates" JSONB,
ALTER COLUMN "password" SET NOT NULL;
