-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SIMPLE', 'ADVANCED', 'ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'SIMPLE';
