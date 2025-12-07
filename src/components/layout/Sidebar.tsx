"use client";

import { cn } from "@/lib/utils";
import { Activity, Beaker, Home, LogOut, Package, Pill, Settings, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "@/app/actions/auth";
import { useEffect, useState } from "react";

type UserSession = {
    id: string;
    username: string;
    nama: string;
    role: string;
} | null;

const allMenus = [
    { href: "/", label: "Dashboard", icon: Home, roles: ["admin", "registrasi", "poli_umum", "poli_gigi", "farmasi", "lab"] },
    { href: "/registrasi", label: "Pendaftaran", icon: Users, roles: ["admin", "registrasi"] },
    { href: "/poli/umum", label: "Poli Umum", icon: Activity, roles: ["admin", "poli_umum"] },
    { href: "/poli/gigi", label: "Poli Gigi", icon: Activity, roles: ["admin", "poli_gigi"] },
    { href: "/farmasi", label: "Pelayanan Resep", icon: Pill, roles: ["admin", "farmasi"] },
    { href: "/farmasi/inventory", label: "Inventory Obat", icon: Package, roles: ["admin", "farmasi"] },
    { href: "/lab", label: "Laboratorium", icon: Beaker, roles: ["admin", "lab"] },
    { href: "/admin", label: "Admin", icon: Settings, roles: ["admin"] },
];

interface SidebarProps {
    user?: UserSession;
}

export function Sidebar({ user }: SidebarProps) {
    const pathname = usePathname();

    // Filter menus based on user role
    const menus = user
        ? allMenus.filter(m => m.roles.includes(user.role))
        : allMenus.filter(m => m.roles.length === 6); // Show all if no user (will redirect anyway)

    return (
        <aside className="w-64 border-r bg-white h-screen flex flex-col fixed left-0 top-0 z-10 shadow-sm">
            <div className="p-6 border-b flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                    E
                </div>
                <span className="font-bold text-xl text-slate-800">eRM Klinik</span>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menus.map((k) => {
                    const isActive = k.href === "/" ? pathname === "/" : pathname.startsWith(k.href);
                    return (
                        <Link
                            key={k.href}
                            href={k.href}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-slate-900 text-white shadow-sm"
                                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                            )}
                        >
                            <k.icon className={cn("w-4 h-4", isActive ? "text-white" : "text-slate-500")} />
                            {k.label}
                        </Link>
                    );
                })}
            </nav>

            {user && (
                <div className="p-4 border-t">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-medium text-sm">
                            {user.nama.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{user.nama}</p>
                            <p className="text-xs text-slate-500 capitalize">{user.role.replace("_", " ")}</p>
                        </div>
                    </div>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </form>
                </div>
            )}

            <div className="p-4 border-t text-xs text-slate-400 text-center">
                v1.1.0 MVP
            </div>
        </aside>
    );
}
