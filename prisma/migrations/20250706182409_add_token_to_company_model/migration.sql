/*
  Warnings:

  - Added the required column `token` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Company_subdomain_key";

-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "token" TEXT NOT NULL;
