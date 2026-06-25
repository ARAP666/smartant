CREATE TABLE "pending_movements" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "amount_minor" BIGINT NOT NULL,
  "date" DATE NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'PENDING',
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "pending_movements_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "pending_movements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "pending_movements_user_id_status_idx" ON "pending_movements"("user_id", "status");
