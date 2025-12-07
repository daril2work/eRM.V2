"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLabRequests(status: string = "menunggu") {
    return await prisma.labRequest.findMany({
        where: { status },
        include: {
            visit: {
                include: {
                    patient: true
                }
            },
            result: true
        },
        orderBy: { created_at: "asc" }
    });
}

export async function getLabRequestDetail(id: string) {
    return await prisma.labRequest.findUnique({
        where: { id },
        include: {
            visit: {
                include: {
                    patient: true
                }
            },
            result: true
        }
    });
}

export async function submitLabResult(requestId: string, hasil: string, catatan: string) {
    // Create result and update request status
    await prisma.$transaction([
        prisma.labResult.create({
            data: {
                lab_request_id: requestId,
                hasil,
                catatan
            }
        }),
        prisma.labRequest.update({
            where: { id: requestId },
            data: { status: "selesai" }
        })
    ]);
    revalidatePath("/lab");
}
