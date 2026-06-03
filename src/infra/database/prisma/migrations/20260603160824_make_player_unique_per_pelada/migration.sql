/*
  Warnings:

  - The `position` column on the `Player` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[peladaId,name]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PlayerPosition" AS ENUM ('ZAGA', 'MEIO', 'ATAQUE', 'GERAL');

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "position",
ADD COLUMN     "position" "PlayerPosition" NOT NULL DEFAULT 'GERAL';

-- CreateIndex
CREATE UNIQUE INDEX "Player_peladaId_name_key" ON "Player"("peladaId", "name");
