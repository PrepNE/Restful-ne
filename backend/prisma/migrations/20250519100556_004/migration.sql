/*
  Warnings:

  - A unique constraint covering the columns `[nationalId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `capacity` on the `ParkingLot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `hourlyRate` on the `ParkingLot` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `nationalId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ParkingLot" DROP COLUMN "capacity",
ADD COLUMN     "capacity" INTEGER NOT NULL,
DROP COLUMN "hourlyRate",
ADD COLUMN     "hourlyRate" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "nationalId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_nationalId_key" ON "User"("nationalId");
