"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVisitsByPoli(poli: string, status: string = "menunggu") {
    // status: "menunggu" means queue. "selesai" means history. "diproses" is active.
    return await prisma.visit.findMany({
        where: {
            poli,
            status, // or logic for "Belum Dilayani" = ['menunggu', 'diproses']? PRD says just "Belum Dilayani" tab.
        },
        include: {
            patient: true,
        },
        orderBy: {
            created_at: "asc",
        },
    });
}

export async function getVisitDetail(id: string) {
    return await prisma.visit.findUnique({
        where: { id },
        include: {
            patient: true,
            soap_note: true,
            diagnoses: true,
            treatments: true,
            prescriptions: { include: { items: true } },
            lab_requests: { include: { result: true } },
        },
    });
}

export async function updateVisitStatus(id: string, status: string) {
    await prisma.visit.update({
        where: { id },
        data: { status },
    });
    revalidatePath("/poli");
}

export async function saveSoap(visitId: string, data: { subjective: string; objective: string; assessment: string; plan: string }) {
    await prisma.soapNote.upsert({
        where: { visit_id: visitId },
        create: { visit_id: visitId, ...data },
        update: { ...data },
    });
    revalidatePath(`/poli`);
    return { success: true };
}

export async function addDiagnosis(visitId: string, icd: string, desc: string) {
    await prisma.diagnosis.create({
        data: { visit_id: visitId, icd_code: icd, description: desc }
    });
    revalidatePath(`/poli`);
    return { success: true };
}

export async function savePrescription(visitId: string, items: { nama_obat: string; aturan: string; jumlah: number }[]) {
    // Check if prescription already exists for this visit? PRD implies "Buat resep".
    // We can assume one prescription per visit or multiple.
    // Let's create a new one each time for simplicity, or handle "menunggu" status.
    await prisma.prescription.create({
        data: {
            visit_id: visitId,
            status: "menunggu",
            items: {
                create: items
            }
        }
    });
    revalidatePath(`/poli`);
    return { success: true };
}

export async function saveLabRequest(visitId: string, testNames: string[]) {
    await prisma.labRequest.createMany({
        data: testNames.map(name => ({
            visit_id: visitId,
            test_name: name,
            status: "menunggu"
        }))
    });
    revalidatePath(`/poli`);
    return { success: true };
}

export async function finishVisit(visitId: string, poli: string) {
    await prisma.visit.update({
        where: { id: visitId },
        data: { status: "selesai" }
    });
    revalidatePath(`/poli/${poli}`);
}
