import { requireAuth } from "@/app/actions/auth";
import { getUsers, toggleUserActive } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, UserPlus, Users } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const roleLabels: Record<string, string> = {
    admin: "Administrator",
    registrasi: "Registrasi",
    poli_umum: "Poli Umum",
    poli_gigi: "Poli Gigi",
    farmasi: "Farmasi",
    lab: "Laboratorium",
};

const roleBadgeColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    registrasi: "bg-blue-100 text-blue-700",
    poli_umum: "bg-green-100 text-green-700",
    poli_gigi: "bg-teal-100 text-teal-700",
    farmasi: "bg-orange-100 text-orange-700",
    lab: "bg-indigo-100 text-indigo-700",
};

async function handleToggle(id: string) {
    "use server";
    await toggleUserActive(id);
    revalidatePath("/admin");
}

export default async function AdminPage() {
    const user = await requireAuth();

    if (user.role !== "admin") {
        redirect("/");
    }

    const users = await getUsers();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
                    <p className="text-slate-500">Kelola pengguna sistem</p>
                </div>
                <Link href="/admin/users/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Tambah User
                    </Button>
                </Link>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total User</CardTitle>
                        <Users className="w-4 h-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{users.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">User Aktif</CardTitle>
                        <Shield className="w-4 h-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            {users.filter((u: any) => u.active).length}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">User Nonaktif</CardTitle>
                        <Shield className="w-4 h-4 text-red-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-red-500">
                            {users.filter((u: any) => !u.active).length}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Daftar Pengguna</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b text-left text-sm text-slate-500">
                                    <th className="pb-3 font-medium">Username</th>
                                    <th className="pb-3 font-medium">Nama</th>
                                    <th className="pb-3 font-medium">Role</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {users.map((u: any) => (
                                    <tr key={u.id} className="text-sm">
                                        <td className="py-3 font-mono text-slate-700">{u.username}</td>
                                        <td className="py-3 font-medium">{u.nama}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleBadgeColors[u.role] || "bg-slate-100"}`}>
                                                {roleLabels[u.role] || u.role}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                                {u.active ? "Aktif" : "Nonaktif"}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/users/${u.id}`}>
                                                    <Button variant="outline" size="sm">Edit</Button>
                                                </Link>
                                                <form action={handleToggle.bind(null, u.id)}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        className={u.active ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}
                                                    >
                                                        {u.active ? "Nonaktifkan" : "Aktifkan"}
                                                    </Button>
                                                </form>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
