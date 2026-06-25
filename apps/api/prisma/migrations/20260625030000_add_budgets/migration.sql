CREATE TABLE "budgets" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "amount_minor" BIGINT NOT NULL,
  "period" TEXT NOT NULL,
  "category" TEXT,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "budgets_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "budgets_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "budgets_user_id_period_category_idx" ON "budgets"("user_id", "period", "category");
