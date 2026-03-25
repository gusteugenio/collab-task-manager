/*
  Warnings:

  - You are about to drop the column `permission` on the `TaskCollaborator` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "TaskCollaborator" DROP COLUMN "permission";

-- DropEnum
DROP TYPE "Permission";
