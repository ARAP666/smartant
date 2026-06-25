CREATE TABLE "salaries" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "user_id" UUID NOT NULL,
  "amount_minor" BIGINT NOT NULL,
  "frequency" TEXT NOT NULL,
  "next_date" DATE NOT NULL,
  "paused_at" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "salaries_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "salaries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "salaries_user_id_key" ON "salaries"("user_id");

CREATE TABLE "salary_runs" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "salary_id" UUID NOT NULL,
  "income_id" UUID NOT NULL,
  "period_key" TEXT NOT NULL,
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "salary_runs_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "salary_runs_salary_id_fkey" FOREIGN KEY ("salary_id") REFERENCES "salaries"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "salary_runs_income_id_fkey" FOREIGN KEY ("income_id") REFERENCES "incomes"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "salary_runs_income_id_key" ON "salary_runs"("income_id");
CREATE UNIQUE INDEX "salary_runs_salary_id_period_key_key" ON "salary_runs"("salary_id", "period_key");
