"use server";

import prisma from "@/lib/prisma";

export async function getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Today's visits
    const todayVisits = await prisma.visit.count({
        where: {
            tanggal: {
                gte: today,
                lt: tomorrow,
            },
        },
    });

    // Visits by status today
    const waitingVisits = await prisma.visit.count({
        where: {
            tanggal: { gte: today, lt: tomorrow },
            status: "menunggu",
        },
    });

    const inProgressVisits = await prisma.visit.count({
        where: {
            tanggal: { gte: today, lt: tomorrow },
            status: "diproses",
        },
    });

    const completedVisits = await prisma.visit.count({
        where: {
            tanggal: { gte: today, lt: tomorrow },
            status: "selesai",
        },
    });

    // By poli
    const poliUmumVisits = await prisma.visit.count({
        where: {
            tanggal: { gte: today, lt: tomorrow },
            poli: "umum",
        },
    });

    const poliGigiVisits = await prisma.visit.count({
        where: {
            tanggal: { gte: today, lt: tomorrow },
            poli: "gigi",
        },
    });

    // Pharmacy queue
    const pharmacyQueue = await prisma.prescription.count({
        where: {
            status: "menunggu",
        },
    });

    // Lab queue
    const labQueue = await prisma.labRequest.count({
        where: {
            status: "menunggu",
        },
    });

    // Total patients
    const totalPatients = await prisma.patient.count();

    // New patients today
    const newPatientsToday = await prisma.patient.count({
        where: {
            created_at: { gte: today, lt: tomorrow },
        },
    });

    return {
        todayVisits,
        waitingVisits,
        inProgressVisits,
        completedVisits,
        poliUmumVisits,
        poliGigiVisits,
        pharmacyQueue,
        labQueue,
        totalPatients,
        newPatientsToday,
    };
}
