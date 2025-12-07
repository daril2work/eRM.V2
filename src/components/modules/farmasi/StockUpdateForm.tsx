"use client";

import { updateStock } from "@/app/actions/inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface StockUpdateFormProps {
    medicine: {
        id: string;
        kode: string;
        nama: string;
        satuan: string;
        stok: number;
    };
}

export function StockUpdateForm({ medicine }: StockUpdateFormProps) {
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [tipe, setTipe] = useState<"masuk" | "keluar">("masuk");

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");

        const jumlah = parseInt(formData.get("jumlah") as string);

        if (jumlah <= 0) {
            setError("Jumlah harus lebih dari 0");
            setLoading(false);
            return;
        }

        const result = await updateStock(medicine.id, jumlah, tipe);

        if (result.error) {
            setError(result.error);
            setLoading(false);
        } else {
            router.push("/farmasi/inventory");
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Update Stok</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="mb-6 p-4 bg-slate-50 rounded-lg">
                    <p className="text-sm text-slate-500">Obat</p>
                    <p className="font-bold text-lg">{medicine.nama}</p>
                    <p className="text-sm text-slate-500">Kode: {medicine.kode}</p>
                    <p className="text-2xl font-bold mt-2 text-blue-600">
                        Stok: {medicine.stok} {medicine.satuan}
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label>Tipe Transaksi</Label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="tipe"
                                    value="masuk"
                                    checked={tipe === "masuk"}
                                    onChange={() => setTipe("masuk")}
                                    className="w-4 h-4"
                                />
                                <span className="text-green-600 font-medium">Stok Masuk</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="tipe"
                                    value="keluar"
                                    checked={tipe === "keluar"}
                                    onChange={() => setTipe("keluar")}
                                    className="w-4 h-4"
                                />
                                <span className="text-red-600 font-medium">Stok Keluar</span>
                            </label>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="jumlah">Jumlah ({medicine.satuan})</Label>
                        <Input id="jumlah" name="jumlah" type="number" min="1" required placeholder="0" />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            className={tipe === "masuk" ? "bg-green-600 hover:bg-green-700" : "bg-red-600 hover:bg-red-700"}
                            disabled={loading}
                        >
                            {loading ? "Menyimpan..." : tipe === "masuk" ? "Tambah Stok" : "Kurangi Stok"}
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
