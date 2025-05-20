/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `nationalId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `ParkingLot` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `ParkingLot` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'PARKING_ATTENDANT');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'PARKING_ATTENDANT';
COMMIT;

-- DropIndex
DROP INDEX "User_nationalId_key";

-- AlterTable
ALTER TABLE "ParkingLot" ADD COLUMN     "code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "nationalId",
ALTER COLUMN "role" SET DEFAULT 'PARKING_ATTENDANT';

-- CreateIndex
CREATE UNIQUE INDEX "ParkingLot_code_key" ON "ParkingLot"("code");
