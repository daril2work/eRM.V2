-- CreateTable
CREATE TABLE "Patient" (
    "id" TEXT NOT NULL,
    "no_rm" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "tanggal_lahir" TIMESTAMP(3) NOT NULL,
    "gender" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "no_hp" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Visit" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "poli" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'menunggu',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Visit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SickLetter" (
    "id" TEXT NOT NULL,
    "visit_id" TEXT NOT NULL,
    "tanggal_mulai" TIMESTAMP(3) NOT NULL,
    "jumlah_hari" INTEGER NOT NULL,
    "keterangan" TEXT,
    "nomor_surat" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SickLetter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DentalRecord" (
    "id" TEXT NOT NULL,
    "visit_id" TEXT NOT NULL,
    "tooth_num" TEXT NOT NULL,
    "condition" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DentalRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoapNote" (
    "id" TEXT NOT NULL,
    "visit_id" TEXT NOT NULL,
    "subjective" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "assessment" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SoapNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Diagnosis" (
    "id" TEXT NOT NULL,
    "visit_id" TEXT NOT NULL,
    "icd_code" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diagnosis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Treatment" (
    "id" TEXT NOT NULL,
    "visit_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Treatment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prescription" (
    "id" TEXT NOT NULL,
    "visit_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'menunggu',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Prescription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrescriptionItem" (
    "id" TEXT NOT NULL,
    "prescription_id" TEXT NOT NULL,
    "nama_obat" TEXT NOT NULL,
    "aturan" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,

    CONSTRAINT "PrescriptionItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabRequest" (
    "id" TEXT NOT NULL,
    "visit_id" TEXT NOT NULL,
    "test_name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'menunggu',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LabRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LabResult" (
    "id" TEXT NOT NULL,
    "lab_request_id" TEXT NOT NULL,
    "hasil" TEXT NOT NULL,
    "catatan" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LabResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Medicine" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "satuan" TEXT NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "harga" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "minStok" INTEGER NOT NULL DEFAULT 10,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Medicine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Patient_no_rm_key" ON "Patient"("no_rm");

-- CreateIndex
CREATE UNIQUE INDEX "SickLetter_visit_id_key" ON "SickLetter"("visit_id");

-- CreateIndex
CREATE UNIQUE INDEX "DentalRecord_visit_id_tooth_num_key" ON "DentalRecord"("visit_id", "tooth_num");

-- CreateIndex
CREATE UNIQUE INDEX "SoapNote_visit_id_key" ON "SoapNote"("visit_id");

-- CreateIndex
CREATE UNIQUE INDEX "LabResult_lab_request_id_key" ON "LabResult"("lab_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Medicine_kode_key" ON "Medicine"("kode");

-- AddForeignKey
ALTER TABLE "Visit" ADD CONSTRAINT "Visit_patient_id_fkey" FOREIGN KEY ("patient_id") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SickLetter" ADD CONSTRAINT "SickLetter_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DentalRecord" ADD CONSTRAINT "DentalRecord_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoapNote" ADD CONSTRAINT "SoapNote_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Diagnosis" ADD CONSTRAINT "Diagnosis_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Treatment" ADD CONSTRAINT "Treatment_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prescription" ADD CONSTRAINT "Prescription_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrescriptionItem" ADD CONSTRAINT "PrescriptionItem_prescription_id_fkey" FOREIGN KEY ("prescription_id") REFERENCES "Prescription"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabRequest" ADD CONSTRAINT "LabRequest_visit_id_fkey" FOREIGN KEY ("visit_id") REFERENCES "Visit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LabResult" ADD CONSTRAINT "LabResult_lab_request_id_fkey" FOREIGN KEY ("lab_request_id") REFERENCES "LabRequest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
