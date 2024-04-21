/*
  Warnings:

  - The primary key for the `SharedNote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SharedNote` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SharedNote" DROP CONSTRAINT "SharedNote_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "SharedNote_pkey" PRIMARY KEY ("sharedBy", "sharedTo");
