"use client";

import { savePrescription } from "@/app/actions/poli";
import { searchMedicines } from "@/app/actions/inventory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Search } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface Medicine {
    id: string;
    kode: string;
    nama: string;
    satuan: string;
    stok: number;
}

interface PrescriptionItem {
    nama_obat: string;
    aturan: string;
    jumlah: number;
    medicineId?: string;
    satuan?: string;
}

interface PrescriptionBuilderProps {
    visitId: string;
}

export function PrescriptionBuilder({ visitId }: PrescriptionBuilderProps) {
    const [items, setItems] = useState<PrescriptionItem[]>([
        { nama_obat: "", aturan: "", jumlah: 1 }
    ]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [searchResults, setSearchResults] = useState<Medicine[]>([]);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(async () => {
            const results = await searchMedicines(searchQuery);
            setSearchResults(results);
        }, 300);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const addItem = () => {
        setItems([...items, { nama_obat: "", aturan: "", jumlah: 1 }]);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
        if (activeIndex === index) {
            setActiveIndex(null);
            setSearchResults([]);
        }
    };

    const updateItem = (index: number, field: string, value: string | number) => {
        const newItems = [...items];
        (newItems[index] as any)[field] = value;
        setItems(newItems);
    };

    const selectMedicine = (index: number, medicine: Medicine) => {
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            nama_obat: medicine.nama,
            medicineId: medicine.id,
            satuan: medicine.satuan,
        };
        setItems(newItems);
        setActiveIndex(null);
        setSearchResults([]);
        setSearchQuery("");
    };

    const handleSearchFocus = (index: number) => {
        setActiveIndex(index);
        setSearchQuery(items[index].nama_obat);
    };

    async function handleSave() {
        setLoading(true);
        const validItems = items.filter(i => i.nama_obat.trim() !== "");
        if (validItems.length === 0) {
            alert("Isi minimal satu obat");
            setLoading(false);
            return;
        }

        await savePrescription(visitId, validItems.map(i => ({
            nama_obat: i.nama_obat,
            aturan: i.aturan,
            jumlah: i.jumlah,
        })));

        setLoading(false);
        setMessage("Resep dikirim ke Farmasi!");
        setItems([{ nama_obat: "", aturan: "", jumlah: 1 }]);
        setTimeout(() => setMessage(""), 3000);
    }

    return (
        <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-semibold text-lg">Input Resep Obat</h3>
            {message && <div className="text-green-600 text-sm bg-green-50 p-2 rounded">{message}</div>}

            {items.map((item, index) => (
                <div key={index} className="flex gap-2 items-end relative">
                    <div className="flex-1 space-y-1 relative">
                        <Label className="text-xs">Nama Obat</Label>
                        <div className="relative">
                            <Input
                                value={item.nama_obat}
                                onChange={(e) => {
                                    updateItem(index, "nama_obat", e.target.value);
                                    setSearchQuery(e.target.value);
                                    setActiveIndex(index);
                                }}
                                onFocus={() => handleSearchFocus(index)}
                                placeholder="Ketik nama obat..."
                                className="pr-8"
                            />
                            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        </div>
                        {activeIndex === index && searchResults.length > 0 && (
                            <div className="absolute z-50 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-y-auto">
                                {searchResults.map((med) => (
                                    <button
                                        key={med.id}
                                        type="button"
                                        className="w-full px-3 py-2 text-left hover:bg-slate-100 flex justify-between items-center text-sm"
                                        onClick={() => selectMedicine(index, med)}
                                    >
                                        <div>
                                            <p className="font-medium">{med.nama}</p>
                                            <p className="text-xs text-slate-500">{med.kode} • {med.satuan}</p>
                                        </div>
                                        <span className={`text-xs px-2 py-0.5 rounded ${med.stok > 10 ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                                            Stok: {med.stok}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 space-y-1">
                        <Label className="text-xs">Aturan Pakai</Label>
                        <Input
                            value={item.aturan}
                            onChange={(e) => updateItem(index, "aturan", e.target.value)}
                            placeholder="Ex: 3x1 sesudah makan"
                        />
                    </div>
                    <div className="w-20 space-y-1">
                        <Label className="text-xs">Jumlah</Label>
                        <Input
                            type="number"
                            value={item.jumlah}
                            onChange={(e) => updateItem(index, "jumlah", parseInt(e.target.value) || 0)}
                            min="1"
                        />
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => removeItem(index)} className="mb-0.5" disabled={items.length === 1}>
                        <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                </div>
            ))}

            <div className="flex gap-2">
                <Button variant="outline" onClick={addItem} size="sm">
                    <Plus className="w-4 h-4 mr-2" /> Tambah Obat
                </Button>
                <Button onClick={handleSave} disabled={loading} size="sm" className="bg-blue-600 hover:bg-blue-700">
                    {loading ? "Menyimpan..." : "Kirim Resep"}
                </Button>
            </div>
        </div>
    );
}
