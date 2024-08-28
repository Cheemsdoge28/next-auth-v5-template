-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "student_id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "sex" TEXT NOT NULL DEFAULT 'M',
    "standard" TEXT,
    "birth_date" TIMESTAMP(3),
    "receipt_no" TEXT NOT NULL,
    "mode_of_payment" TEXT,
    "fee_received" DOUBLE PRECISION,
    "total_fee_received" DOUBLE PRECISION,
    "pending_fee_amount" DOUBLE PRECISION,
    "book_amount" DOUBLE PRECISION,
    "shirt" BOOLEAN NOT NULL DEFAULT false,
    "pant" BOOLEAN NOT NULL DEFAULT false,
    "formals" BOOLEAN NOT NULL DEFAULT false,
    "email_id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("student_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Student_receipt_no_key" ON "Student"("receipt_no");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_id_key" ON "Student"("email_id");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
