/*
  Warnings:

  - You are about to drop the column `userId` on the `Pelada` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `ownerId` to the `Pelada` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Pelada` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `username` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GlobalRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "PeladaPrivilege" AS ENUM ('MANAGE_PLAYERS', 'DRAW_TEAMS', 'FULL_ACCESS');

-- DropForeignKey
ALTER TABLE "Pelada" DROP CONSTRAINT "Pelada_userId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_peladaId_fkey";

-- AlterTable
ALTER TABLE "Pelada" DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "ownerId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "position" SET DEFAULT 'Geral';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "GlobalRole" NOT NULL DEFAULT 'USER',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "username" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "PeladaPermission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "peladaId" TEXT NOT NULL,
    "privilege" "PeladaPrivilege" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PeladaPermission_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PeladaPermission_userId_peladaId_privilege_key" ON "PeladaPermission"("userId", "peladaId", "privilege");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Pelada" ADD CONSTRAINT "Pelada_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaPermission" ADD CONSTRAINT "PeladaPermission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PeladaPermission" ADD CONSTRAINT "PeladaPermission_peladaId_fkey" FOREIGN KEY ("peladaId") REFERENCES "Pelada"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_peladaId_fkey" FOREIGN KEY ("peladaId") REFERENCES "Pelada"("id") ON DELETE CASCADE ON UPDATE CASCADE;
