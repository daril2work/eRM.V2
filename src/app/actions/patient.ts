"use server";

import prisma from "@/lib/prisma";

export async function getPatientHistory(patientId: string) {
    const patient = await prisma.patient.findUnique({
        where: { id: patientId },
        include: {
            visits: {
                orderBy: { tanggal: "desc" },
                include: {
                    soap_note: true,
                    diagnoses: true,
                    prescriptions: {
                        include: { items: true },
                    },
                    lab_requests: {
                        include: { result: true },
                    },
                },
            },
        },
    });

    return patient;
}

export async function getPatientVisitCount(patientId: string) {
    return prisma.visit.count({
        where: { patient_id: patientId },
    });
}
