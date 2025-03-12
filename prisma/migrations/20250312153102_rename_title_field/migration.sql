/*
  Warnings:

  - You are about to drop the column `titlte` on the `incidencias` table. All the data in the column will be lost.
  - Added the required column `title` to the `incidencias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "incidencias" DROP COLUMN "titlte",
ADD COLUMN     "title" TEXT NOT NULL;
