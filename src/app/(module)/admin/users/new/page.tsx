"use client";

import { createUser } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

const roles = [
    { value: "admin", label: "Administrator" },
    { value: "registrasi", label: "Registrasi" },
    { value: "poli_umum", label: "Poli Umum" },
    { value: "poli_gigi", label: "Poli Gigi" },
    { value: "farmasi", label: "Farmasi" },
    { value: "lab", label: "Laboratorium" },
];

export default function NewUserPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");

        const result = await createUser({
            username: formData.get("username") as string,
            password: formData.get("password") as string,
            nama: formData.get("nama") as string,
            role: formData.get("role") as string,
        });

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/admin");
        }
    }

    return (
        <div className="max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Tambah User Baru</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Data Pengguna</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Lengkap</Label>
                            <Input id="nama" name="nama" required placeholder="Nama lengkap petugas" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" name="username" required placeholder="Username untuk login" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" name="password" type="password" required placeholder="Password" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role">Role / Bagian</Label>
                            <select
                                id="role"
                                name="role"
                                required
                                className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Pilih role...</option>
                                {roles.map(r => (
                                    <option key={r.value} value={r.value}>{r.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                                {loading ? "Menyimpan..." : "Simpan"}
                            </Button>
                            <Button type="button" variant="outline" onClick={() => router.back()}>
                                Batal
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
