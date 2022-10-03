/*
  Warnings:

  - Added the required column `publishedAt` to the `video` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "video" ADD COLUMN     "publishedAt" TEXT NOT NULL,
ADD COLUMN     "tags" TEXT[];
