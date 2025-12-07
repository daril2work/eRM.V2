"use client";

import { updateMedicine, toggleMedicineActive } from "@/app/actions/inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface Medicine {
    id: string;
    kode: string;
    nama: string;
    satuan: string;
    stok: number;
    harga: number;
    minStok: number;
    active: boolean;
}

interface MedicineEditFormProps {
    medicine: Medicine;
}

export function MedicineEditForm({ medicine }: MedicineEditFormProps) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");

        const result = await updateMedicine(medicine.id, {
            nama: formData.get("nama") as string,
            satuan: formData.get("satuan") as string,
            harga: parseFloat(formData.get("harga") as string) || 0,
            minStok: parseInt(formData.get("minStok") as string) || 10,
        });

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/farmasi/inventory");
        }
    }

    async function handleToggleActive() {
        await toggleMedicineActive(medicine.id);
        router.refresh();
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Edit Data Obat</CardTitle>
                </CardHeader>
                <CardContent>
                    <form action={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Kode Obat</Label>
                                <Input value={medicine.kode} disabled className="bg-slate-100" />
                                <p className="text-xs text-slate-500">Kode tidak dapat diubah</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="satuan">Satuan</Label>
                                <select
                                    id="satuan"
                                    name="satuan"
                                    defaultValue={medicine.satuan}
                                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                                >
                                    <option value="Tablet">Tablet</option>
                                    <option value="Kapsul">Kapsul</option>
                                    <option value="Sirup">Sirup</option>
                                    <option value="Salep">Salep</option>
                                    <option value="Injeksi">Injeksi</option>
                                    <option value="Tetes">Tetes</option>
                                    <option value="Sachet">Sachet</option>
                                    <option value="Tube">Tube</option>
                                    <option value="Botol">Botol</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="nama">Nama Obat</Label>
                            <Input id="nama" name="nama" required defaultValue={medicine.nama} />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="minStok">Minimum Stok</Label>
                                <Input id="minStok" name="minStok" type="number" min="0" defaultValue={medicine.minStok} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="harga">Harga (Rp)</Label>
                                <Input id="harga" name="harga" type="number" min="0" defaultValue={medicine.harga} />
                            </div>
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

            <Card>
                <CardHeader>
                    <CardTitle>Stok Saat Ini</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-3xl font-bold text-blue-600">{medicine.stok} {medicine.satuan}</p>
                            <p className="text-sm text-slate-500">Min. stok: {medicine.minStok}</p>
                        </div>
                        <Button variant="outline" onClick={() => router.push(`/farmasi/inventory/${medicine.id}/stock`)}>
                            Update Stok
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card className={medicine.active ? "border-green-200" : "border-red-200"}>
                <CardHeader>
                    <CardTitle>Status Obat</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${medicine.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                                {medicine.active ? "Aktif" : "Nonaktif"}
                            </span>
                            <p className="text-sm text-slate-500 mt-2">
                                {medicine.active
                                    ? "Obat ini tersedia untuk diresepkan"
                                    : "Obat ini tidak akan muncul di daftar resep"}
                            </p>
                        </div>
                        <Button
                            variant="outline"
                            onClick={handleToggleActive}
                            className={medicine.active ? "text-red-600 hover:bg-red-50" : "text-green-600 hover:bg-green-50"}
                        >
                            {medicine.active ? "Nonaktifkan" : "Aktifkan"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
