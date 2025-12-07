"use client";

import { createVisit, searchPatients } from "@/app/actions/registrasi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState } from "react";

export function PatientSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    async function handleSearch() {
        setLoading(true);
        const data = await searchPatients(query);
        setResults(data);
        setLoading(false);
    }

    async function handleCreateVisit(patientId: string, poli: string) {
        if (confirm(`Daftarkan ke Poli ${poli}?`)) {
            await createVisit(patientId, poli);
            alert("Berhasil masuk antrian!");
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                        className="pl-9 h-11 bg-slate-50 border-slate-200 focus-visible:ring-blue-500"
                        placeholder="Cari nama pasien atau No RM..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                </div>
                <Button onClick={handleSearch} disabled={loading} size="lg" className="bg-blue-600 hover:bg-blue-700 shadow-sm text-white">
                    {loading ? "Mencari..." : "Cari Pasien"}
                </Button>
            </div>

            <div className="space-y-4">
                {results.map((patient) => (
                    <div key={patient.id} className="group relative flex flex-col md:flex-row gap-4 p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-200 hover:shadow-md transition-all">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">{patient.nama}</h3>
                                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-mono">{patient.no_rm}</span>
                            </div>
                            <div className="text-sm text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
                                <span>{patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                                <span>•</span>
                                <span>{patient.alamat}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-blue-600" variant="outline" size="sm" onClick={() => handleCreateVisit(patient.id, "umum")}>
                                Daftar Poli Umum
                            </Button>
                            <Button className="bg-white text-slate-700 border-slate-200 hover:bg-slate-50 hover:text-teal-600" variant="outline" size="sm" onClick={() => handleCreateVisit(patient.id, "gigi")}>
                                Daftar Poli Gigi
                            </Button>
                        </div>
                    </div>
                ))}
                {results.length === 0 && !loading && (
                    <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>Belum ada data yang dicari.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
