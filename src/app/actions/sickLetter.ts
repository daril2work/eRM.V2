"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getSickLetter(visitId: string) {
    return prisma.sickLetter.findUnique({
        where: { visit_id: visitId },
        include: {
            visit: {
                include: {
                    patient: true,
                    diagnoses: true,
                },
            },
        },
    });
}

export async function createSickLetter(data: {
    visitId: string;
    tanggalMulai: Date;
    jumlahHari: number;
    keterangan?: string;
}) {
    // Generate nomor surat: SKS/YYYYMMDD/XXX
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10).replace(/-/g, "");

    // Count existing letters today for sequential number
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const countToday = await prisma.sickLetter.count({
        where: {
            created_at: {
                gte: startOfDay,
                lte: endOfDay,
            },
        },
    });

    const nomorSurat = `SKS/${dateStr}/${String(countToday + 1).padStart(3, "0")}`;

    const sickLetter = await prisma.sickLetter.create({
        data: {
            visit_id: data.visitId,
            tanggal_mulai: data.tanggalMulai,
            jumlah_hari: data.jumlahHari,
            keterangan: data.keterangan,
            nomor_surat: nomorSurat,
        },
        include: {
            visit: {
                include: {
                    patient: true,
                    diagnoses: true,
                },
            },
        },
    });

    revalidatePath("/poli");
    return { success: true, sickLetter };
}

export async function deleteSickLetter(visitId: string) {
    await prisma.sickLetter.deleteMany({
        where: { visit_id: visitId },
    });
    revalidatePath("/poli");
    return { success: true };
}
