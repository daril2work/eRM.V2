"use client";

import { registerPatient } from "@/app/actions/registrasi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function PatientForm() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const result = await registerPatient(formData);
        setLoading(false);
        if (result.success) {
            setMessage(`Pasien berhasil didaftarkan! No RM: ${result.no_rm}`);
            // meaningful reset logic or redirect could go here
        }
    }

    return (
        <form action={handleSubmit} className="space-y-4 border p-4 rounded-md">
            <h3 className="text-lg font-semibold">Registrasi Pasien Baru</h3>
            {message && <div className="p-2 bg-green-100 text-green-800 rounded">{message}</div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    <Input id="nama" name="nama" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="gender">Jenis Kelamin</Label>
                    <select id="gender" name="gender" className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
                        <option value="L">Laki-laki</option>
                        <option value="P">Perempuan</option>
                    </select>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
                    <Input id="tanggal_lahir" name="tanggal_lahir" type="date" required />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="no_hp">No HP</Label>
                    <Input id="no_hp" name="no_hp" type="tel" />
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="alamat">Alamat</Label>
                <Input id="alamat" name="alamat" required />
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Daftarkan Pasien"}
            </Button>
        </form>
    );
}
