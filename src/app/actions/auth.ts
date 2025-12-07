"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

const SESSION_NAME = "erm_session";

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
}

export async function login(username: string, password: string) {
    const user = await prisma.user.findUnique({
        where: { username },
    });

    if (!user || !user.active) {
        return { error: "Username tidak ditemukan atau akun tidak aktif" };
    }

    const valid = await verifyPassword(password, user.password);
    if (!valid) {
        return { error: "Password salah" };
    }

    // Create session cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_NAME, JSON.stringify({
        id: user.id,
        username: user.username,
        nama: user.nama,
        role: user.role,
    }), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 1 day
    });

    return { success: true, role: user.role };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_NAME);
    redirect("/login");
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const session = cookieStore.get(SESSION_NAME);

    if (!session) return null;

    try {
        return JSON.parse(session.value);
    } catch {
        return null;
    }
}

export async function requireAuth() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/login");
    }
    return user;
}

// Role to allowed paths mapping
const rolePathMap: Record<string, string[]> = {
    admin: ["/", "/registrasi", "/poli/umum", "/poli/gigi", "/farmasi", "/lab", "/admin"],
    registrasi: ["/", "/registrasi"],
    poli_umum: ["/", "/poli/umum"],
    poli_gigi: ["/", "/poli/gigi"],
    farmasi: ["/", "/farmasi"],
    lab: ["/", "/lab"],
};

export async function canAccessPath(path: string): Promise<boolean> {
    const user = await getCurrentUser();
    if (!user) return false;

    const allowedPaths = rolePathMap[user.role] || [];
    return allowedPaths.some(p => path.startsWith(p));
}

export async function getDefaultRedirect(role: string): Promise<string> {
    switch (role) {
        case "admin": return "/admin";
        case "registrasi": return "/registrasi";
        case "poli_umum": return "/poli/umum";
        case "poli_gigi": return "/poli/gigi";
        case "farmasi": return "/farmasi";
        case "lab": return "/lab";
        default: return "/";
    }
}
