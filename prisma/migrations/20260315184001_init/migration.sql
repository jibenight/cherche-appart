-- CreateTable
CREATE TABLE "Property" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "sourceId" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "externalUrl" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "price" REAL NOT NULL,
    "surface" REAL NOT NULL,
    "rooms" INTEGER NOT NULL DEFAULT 0,
    "bedrooms" INTEGER NOT NULL DEFAULT 0,
    "floor" INTEGER,
    "totalFloors" INTEGER,
    "hasParking" BOOLEAN NOT NULL DEFAULT false,
    "hasElevator" BOOLEAN NOT NULL DEFAULT false,
    "hasBalcony" BOOLEAN NOT NULL DEFAULT false,
    "dpe" TEXT NOT NULL DEFAULT 'unknown',
    "condition" TEXT NOT NULL DEFAULT 'good',
    "address" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL,
    "postcode" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lng" REAL NOT NULL,
    "images" TEXT NOT NULL DEFAULT '[]',
    "pricePerM2" REAL NOT NULL,
    "publishedAt" DATETIME NOT NULL,
    "dedupHash" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "lastSeenAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "ScrapeRun" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "provider" TEXT NOT NULL,
    "startedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" DATETIME,
    "status" TEXT NOT NULL DEFAULT 'running',
    "listingsFound" INTEGER NOT NULL DEFAULT 0,
    "listingsNew" INTEGER NOT NULL DEFAULT 0,
    "errorMessage" TEXT
);

-- CreateIndex
CREATE INDEX "Property_lat_lng_idx" ON "Property"("lat", "lng");

-- CreateIndex
CREATE INDEX "Property_city_transactionType_idx" ON "Property"("city", "transactionType");

-- CreateIndex
CREATE INDEX "Property_dedupHash_idx" ON "Property"("dedupHash");

-- CreateIndex
CREATE INDEX "Property_isActive_publishedAt_idx" ON "Property"("isActive", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Property_source_sourceId_key" ON "Property"("source", "sourceId");
