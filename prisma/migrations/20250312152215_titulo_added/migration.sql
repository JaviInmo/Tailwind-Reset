/*
  Warnings:

  - Added the required column `titlte` to the `incidencias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "incidencias" ADD COLUMN     "titlte" TEXT NOT NULL;
