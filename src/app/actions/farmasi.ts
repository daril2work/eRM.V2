"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getPrescriptions(status: string = "menunggu") {
    return await prisma.prescription.findMany({
        where: { status },
        include: {
            visit: {
                include: {
                    patient: true
                }
            },
            items: true
        },
        orderBy: { created_at: "asc" }
    });
}

export async function getPrescriptionDetail(id: string) {
    return await prisma.prescription.findUnique({
        where: { id },
        include: {
            visit: {
                include: {
                    patient: true
                }
            },
            items: true
        }
    });
}

export async function processPrescription(id: string) {
    await prisma.prescription.update({
        where: { id },
        data: { status: "selesai" }
    });
    revalidatePath("/farmasi");
}
