/*
  Warnings:

  - The values [FULL_ACCESS] on the enum `PeladaPrivilege` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PeladaPrivilege_new" AS ENUM ('MANAGE_PLAYERS', 'DRAW_TEAMS');
ALTER TABLE "PeladaPermission" ALTER COLUMN "privilege" TYPE "PeladaPrivilege_new" USING ("privilege"::text::"PeladaPrivilege_new");
ALTER TYPE "PeladaPrivilege" RENAME TO "PeladaPrivilege_old";
ALTER TYPE "PeladaPrivilege_new" RENAME TO "PeladaPrivilege";
DROP TYPE "public"."PeladaPrivilege_old";
COMMIT;
