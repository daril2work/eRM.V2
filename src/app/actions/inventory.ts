"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getMedicines(includeInactive = false) {
    return prisma.medicine.findMany({
        where: includeInactive ? {} : { active: true },
        orderBy: { nama: "asc" },
    });
}

export async function getMedicineById(id: string) {
    return prisma.medicine.findUnique({
        where: { id },
    });
}

export async function searchMedicines(query: string) {
    if (!query) return [];
    return prisma.medicine.findMany({
        where: {
            active: true,
            OR: [
                { nama: { contains: query, mode: "insensitive" } },
                { kode: { contains: query, mode: "insensitive" } },
            ],
        },
        take: 20,
        orderBy: { nama: "asc" },
    });
}

export async function createMedicine(data: {
    kode: string;
    nama: string;
    satuan: string;
    stok?: number;
    harga?: number;
    minStok?: number;
}) {
    const existing = await prisma.medicine.findUnique({
        where: { kode: data.kode },
    });

    if (existing) {
        return { error: "Kode obat sudah digunakan" };
    }

    await prisma.medicine.create({
        data: {
            kode: data.kode,
            nama: data.nama,
            satuan: data.satuan,
            stok: data.stok || 0,
            harga: data.harga || 0,
            minStok: data.minStok || 10,
        },
    });

    revalidatePath("/farmasi/inventory");
    return { success: true };
}

export async function updateMedicine(id: string, data: {
    nama?: string;
    satuan?: string;
    harga?: number;
    minStok?: number;
}): Promise<{ success: boolean; error?: string }> {
    try {
        await prisma.medicine.update({
            where: { id },
            data,
        });

        revalidatePath("/farmasi/inventory");
        return { success: true };
    } catch {
        return { success: false, error: "Gagal mengupdate data obat" };
    }
}

export async function updateStock(id: string, jumlah: number, tipe: "masuk" | "keluar") {
    const medicine = await prisma.medicine.findUnique({ where: { id } });
    if (!medicine) return { error: "Obat tidak ditemukan" };

    const newStok = tipe === "masuk"
        ? medicine.stok + jumlah
        : medicine.stok - jumlah;

    if (newStok < 0) {
        return { error: "Stok tidak mencukupi" };
    }

    await prisma.medicine.update({
        where: { id },
        data: { stok: newStok },
    });

    revalidatePath("/farmasi/inventory");
    return { success: true };
}

export async function toggleMedicineActive(id: string) {
    const medicine = await prisma.medicine.findUnique({ where: { id } });
    if (!medicine) return { error: "Obat tidak ditemukan" };

    await prisma.medicine.update({
        where: { id },
        data: { active: !medicine.active },
    });

    revalidatePath("/farmasi/inventory");
    return { success: true };
}

export async function getLowStockMedicines() {
    return prisma.medicine.findMany({
        where: {
            active: true,
            stok: { lte: prisma.medicine.fields.minStok },
        },
    });
}
