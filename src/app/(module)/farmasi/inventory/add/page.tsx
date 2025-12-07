"use client";

import { createMedicine } from "@/app/actions/inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AddMedicinePage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");

        const result = await createMedicine({
            kode: formData.get("kode") as string,
            nama: formData.get("nama") as string,
            satuan: formData.get("satuan") as string,
            stok: parseInt(formData.get("stok") as string) || 0,
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

    return (
        <div className="max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Tambah Obat Baru</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Data Obat</CardTitle>
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
                                <Label htmlFor="kode">Kode Obat</Label>
                                <Input id="kode" name="kode" required placeholder="OBT001" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="satuan">Satuan</Label>
                                <select
                                    id="satuan"
                                    name="satuan"
                                    required
                                    className="w-full h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                                >
                                    <option value="">Pilih satuan...</option>
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
                            <Input id="nama" name="nama" required placeholder="Paracetamol 500mg" />
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="stok">Stok Awal</Label>
                                <Input id="stok" name="stok" type="number" min="0" defaultValue="0" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="minStok">Min Stok</Label>
                                <Input id="minStok" name="minStok" type="number" min="0" defaultValue="10" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="harga">Harga (Rp)</Label>
                                <Input id="harga" name="harga" type="number" min="0" defaultValue="0" />
                            </div>
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
