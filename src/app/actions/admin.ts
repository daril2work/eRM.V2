"use server";

import prisma from "@/lib/prisma";
import { hashPassword, requireAuth } from "./auth";
import { revalidatePath } from "next/cache";

export async function getUsers() {
    await requireAuth();
    return prisma.user.findMany({
        select: {
            id: true,
            username: true,
            nama: true,
            role: true,
            active: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });
}

export async function createUser(data: {
    username: string;
    password: string;
    nama: string;
    role: string;
}) {
    await requireAuth();

    const existing = await prisma.user.findUnique({
        where: { username: data.username },
    });

    if (existing) {
        return { error: "Username sudah digunakan" };
    }

    const hashedPassword = await hashPassword(data.password);

    await prisma.user.create({
        data: {
            username: data.username,
            password: hashedPassword,
            nama: data.nama,
            role: data.role,
        },
    });

    revalidatePath("/admin");
    return { success: true };
}

export async function updateUser(id: string, data: {
    nama?: string;
    role?: string;
    password?: string;
}): Promise<{ success: boolean; error?: string }> {
    await requireAuth();

    try {
        const updateData: any = {};
        if (data.nama) updateData.nama = data.nama;
        if (data.role) updateData.role = data.role;
        if (data.password) updateData.password = await hashPassword(data.password);

        await prisma.user.update({
            where: { id },
            data: updateData,
        });

        revalidatePath("/admin");
        return { success: true };
    } catch {
        return { success: false, error: "Gagal mengupdate user" };
    }
}

export async function getUserById(id: string) {
    await requireAuth();
    return prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            username: true,
            nama: true,
            role: true,
            active: true,
        },
    });
}

export async function toggleUserActive(id: string) {
    await requireAuth();

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return { error: "User tidak ditemukan" };

    await prisma.user.update({
        where: { id },
        data: { active: !user.active },
    });

    revalidatePath("/admin");
    return { success: true };
}

export async function seedAdminUser() {
    const existing = await prisma.user.findUnique({
        where: { username: "admin" },
    });

    if (!existing) {
        const hashedPassword = await hashPassword("admin123");
        await prisma.user.create({
            data: {
                username: "admin",
                password: hashedPassword,
                nama: "Administrator",
                role: "admin",
            },
        });
        return { created: true };
    }
    return { exists: true };
}
