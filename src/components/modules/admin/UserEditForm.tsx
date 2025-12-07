"use client";

import { updateUser } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

const roleOptions = [
    { value: "admin", label: "Administrator" },
    { value: "registrasi", label: "Registrasi" },
    { value: "poli_umum", label: "Poli Umum" },
    { value: "poli_gigi", label: "Poli Gigi" },
    { value: "farmasi", label: "Farmasi" },
    { value: "lab", label: "Laboratorium" },
];

interface User {
    id: string;
    username: string;
    nama: string;
    role: string;
    active: boolean;
}

interface UserEditFormProps {
    user: User;
}

export function UserEditForm({ user }: UserEditFormProps) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");

        const password = formData.get("password") as string;

        const result = await updateUser(user.id, {
            nama: formData.get("nama") as string,
            role: formData.get("role") as string,
            password: password || undefined, // Only update password if provided
        });

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/admin");
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
                <form action={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Username</Label>
                        <Input value={user.username} disabled className="bg-slate-100" />
                        <p className="text-xs text-slate-500">Username tidak dapat diubah</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="nama">Nama Lengkap</Label>
                        <Input id="nama" name="nama" required defaultValue={user.nama} />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <select
                            id="role"
                            name="role"
                            defaultValue={user.role}
                            className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                        >
                            {roleOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password Baru (opsional)</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Kosongkan jika tidak ingin mengubah password"
                        />
                        <p className="text-xs text-slate-500">
                            Biarkan kosong jika tidak ingin mengubah password
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                            {loading ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Batal
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
