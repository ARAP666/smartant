ALTER TABLE "users"
  ADD COLUMN "currency" TEXT NOT NULL DEFAULT 'CRC',
  ADD COLUMN "time_zone" TEXT NOT NULL DEFAULT 'America/Costa_Rica';
