"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function searchPatients(query: string) {
    if (!query) return [];

    // Search by name, RM, or NIK (NIK not in schema yet, using RM and name for now)
    const patients = await prisma.patient.findMany({
        where: {
            OR: [
                { nama: { contains: query, mode: "insensitive" } },
                { no_rm: { contains: query, mode: "insensitive" } },
            ],
        },
        orderBy: { created_at: "desc" },
        take: 10,
    });

    return patients;
}

export async function registerPatient(formData: FormData) {
    const nama = formData.get("nama") as string;
    const gender = formData.get("gender") as string;
    const alamat = formData.get("alamat") as string;
    const no_hp = formData.get("no_hp") as string;
    const tanggal_lahir_str = formData.get("tanggal_lahir") as string;

    // Generate RM simple logic (YYMM-SEQUENCE) or just random for MVP
    // For MVP, using a simple counter or random string.
    // Better: Count patients + 1.
    const count = await prisma.patient.count();
    const no_rm = `${new Date().getFullYear().toString().slice(-2)}-${(count + 1).toString().padStart(6, "0")}`;

    await prisma.patient.create({
        data: {
            nama,
            no_rm,
            gender,
            alamat,
            no_hp,
            tanggal_lahir: new Date(tanggal_lahir_str),
        },
    });

    revalidatePath("/registrasi");
    return { success: true, message: "Patient registered successfully", no_rm };
}

export async function createVisit(patientId: string, poli: string) {
    await prisma.visit.create({
        data: {
            patient_id: patientId,
            poli,
            status: "menunggu",
        },
    });

    revalidatePath("/registrasi");
    revalidatePath(`/poli/${poli}`);
}
