import { requireAuth } from "@/app/actions/auth";
import { getMedicines } from "@/app/actions/inventory";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Package, Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function InventoryPage() {
    const user = await requireAuth();
    if (!["admin", "farmasi"].includes(user.role)) redirect("/");

    const medicines = await getMedicines(true);
    const lowStock = medicines.filter(m => m.active && m.stok <= m.minStok);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Inventory Obat</h1>
                    <p className="text-slate-500">Kelola stok obat farmasi</p>
                </div>
                <Link href="/farmasi/inventory/add">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Obat
                    </Button>
                </Link>
            </div>

            {lowStock.length > 0 && (
                <Card className="border-orange-200 bg-orange-50">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-orange-700 flex items-center gap-2 text-base">
                            <AlertTriangle className="w-5 h-5" />
                            Stok Rendah ({lowStock.length} item)
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2">
                            {lowStock.map(m => (
                                <span key={m.id} className="px-2 py-1 bg-orange-100 text-orange-800 rounded text-sm">
                                    {m.nama} ({m.stok} {m.satuan})
                                </span>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Total Item</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{medicines.filter(m => m.active).length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Stok Rendah</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-orange-600">{lowStock.length}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500">Non-aktif</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-slate-400">{medicines.filter(m => !m.active).length}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Daftar Obat
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b text-left text-sm text-slate-500">
                                    <th className="pb-3 font-medium">Kode</th>
                                    <th className="pb-3 font-medium">Nama Obat</th>
                                    <th className="pb-3 font-medium">Satuan</th>
                                    <th className="pb-3 font-medium text-right">Stok</th>
                                    <th className="pb-3 font-medium text-right">Min Stok</th>
                                    <th className="pb-3 font-medium">Status</th>
                                    <th className="pb-3 font-medium text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {medicines.map((m) => (
                                    <tr key={m.id} className={`text-sm ${!m.active ? "opacity-50" : ""}`}>
                                        <td className="py-3 font-mono text-slate-600">{m.kode}</td>
                                        <td className="py-3 font-medium">{m.nama}</td>
                                        <td className="py-3 text-slate-600">{m.satuan}</td>
                                        <td className={`py-3 text-right font-bold ${m.stok <= m.minStok ? "text-orange-600" : ""}`}>
                                            {m.stok}
                                        </td>
                                        <td className="py-3 text-right text-slate-500">{m.minStok}</td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${m.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                                                {m.active ? "Aktif" : "Nonaktif"}
                                            </span>
                                        </td>
                                        <td className="py-3 text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/farmasi/inventory/${m.id}`}>
                                                    <Button variant="outline" size="sm">Detail</Button>
                                                </Link>
                                                <Link href={`/farmasi/inventory/${m.id}/stock`}>
                                                    <Button variant="outline" size="sm">Update Stok</Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {medicines.length === 0 && (
                                    <tr>
                                        <td colSpan={7} className="py-8 text-center text-slate-400">
                                            Belum ada data obat. Klik "Tambah Obat" untuk memulai.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
