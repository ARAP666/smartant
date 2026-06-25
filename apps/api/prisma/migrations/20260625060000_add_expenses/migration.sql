CREATE TABLE "expenses" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "pending_movement_id" UUID NOT NULL,
  "idempotency_key" TEXT NOT NULL,
  "amount_minor" BIGINT NOT NULL,
  "date" DATE NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "expenses_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "expenses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "expenses_pending_movement_id_fkey" FOREIGN KEY ("pending_movement_id") REFERENCES "pending_movements"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "expenses_pending_movement_id_key" ON "expenses"("pending_movement_id");
CREATE UNIQUE INDEX "expenses_idempotency_key_key" ON "expenses"("idempotency_key");
CREATE INDEX "expenses_user_id_date_idx" ON "expenses"("user_id", "date");
