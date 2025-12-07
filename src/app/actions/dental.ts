"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getDentalRecords(visitId: string) {
    return prisma.dentalRecord.findMany({
        where: { visit_id: visitId },
    });
}

export async function saveDentalRecord(
    visitId: string,
    toothNum: string,
    condition: string,
    notes?: string
) {
    await prisma.dentalRecord.upsert({
        where: {
            visit_id_tooth_num: {
                visit_id: visitId,
                tooth_num: toothNum,
            },
        },
        create: {
            visit_id: visitId,
            tooth_num: toothNum,
            condition,
            notes,
        },
        update: {
            condition,
            notes,
        },
    });

    revalidatePath(`/poli/gigi`);
    return { success: true };
}

export async function deleteDentalRecord(visitId: string, toothNum: string) {
    await prisma.dentalRecord.deleteMany({
        where: {
            visit_id: visitId,
            tooth_num: toothNum,
        },
    });

    revalidatePath(`/poli/gigi`);
    return { success: true };
}

// Get patient's latest dental records for history
export async function getPatientDentalHistory(patientId: string) {
    const visits = await prisma.visit.findMany({
        where: {
            patient_id: patientId,
            poli: "gigi",
        },
        orderBy: { tanggal: "desc" },
        include: {
            dental_records: true,
        },
        take: 1, // Get only the most recent
    });

    return visits[0]?.dental_records || [];
}
