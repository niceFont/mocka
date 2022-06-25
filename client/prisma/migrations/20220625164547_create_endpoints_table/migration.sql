-- CreateEnum
CREATE TYPE "Method" AS ENUM ('GET', 'POST', 'DELETE', 'PATCH', 'PUT', 'HEAD', 'OPTIONS');

-- CreateTable
CREATE TABLE "Endpoint" (
    "id" SERIAL NOT NULL,
    "method" "Method" NOT NULL DEFAULT E'GET',
    "body_plain" TEXT,
    "body_json" JSONB,
    "headers" JSONB,
    "slug" TEXT NOT NULL,

    CONSTRAINT "Endpoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Endpoint_slug_key" ON "Endpoint"("slug");
