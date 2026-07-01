CREATE TABLE "receipt_attachments" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "expense_id" UUID NOT NULL,
    "original_name" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "receipt_attachments_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "receipt_attachments_expense_id_key" ON "receipt_attachments"("expense_id");
CREATE INDEX "receipt_attachments_user_id_idx" ON "receipt_attachments"("user_id");
ALTER TABLE "receipt_attachments" ADD CONSTRAINT "receipt_attachments_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "expenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "receipt_attachments" ADD CONSTRAINT "receipt_attachments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
