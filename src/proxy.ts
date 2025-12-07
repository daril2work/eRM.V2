import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_NAME = "erm_session";

// Routes that don't require authentication
const publicPaths = ["/login"];

// Role to allowed paths mapping
const rolePathMap: Record<string, string[]> = {
    admin: ["/", "/registrasi", "/poli", "/farmasi", "/lab", "/admin"],
    registrasi: ["/", "/registrasi"],
    poli_umum: ["/", "/poli/umum"],
    poli_gigi: ["/", "/poli/gigi"],
    farmasi: ["/", "/farmasi"],
    lab: ["/", "/lab"],
};

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Allow public paths
    if (publicPaths.some(p => pathname.startsWith(p))) {
        return NextResponse.next();
    }

    // Allow static files and API routes
    if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname.includes(".")) {
        return NextResponse.next();
    }

    // Check for session cookie
    const session = request.cookies.get(SESSION_NAME);

    if (!session) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
        const user = JSON.parse(session.value);
        const allowedPaths = rolePathMap[user.role] || [];

        // Check if user can access this path
        const canAccess = allowedPaths.some(p => {
            if (p === "/") return pathname === "/";
            return pathname.startsWith(p);
        });

        if (!canAccess) {
            // Redirect to their default path
            const defaultPath = getDefaultPath(user.role);
            return NextResponse.redirect(new URL(defaultPath, request.url));
        }

        return NextResponse.next();
    } catch {
        // Invalid session, redirect to login
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

function getDefaultPath(role: string): string {
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

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
