"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, FileText, Pill, FlaskConical, Stethoscope } from "lucide-react";
import { useState } from "react";

interface Visit {
    id: string;
    tanggal: Date;
    poli: string;
    status: string;
    soap_note: {
        subjective: string;
        objective: string;
        assessment: string;
        plan: string;
    } | null;
    diagnoses: { id: string; icd_code: string; description: string | null }[];
    prescriptions: {
        id: string;
        status: string;
        items: { id: string; nama_obat: string; aturan: string; jumlah: number }[];
    }[];
    lab_requests: {
        id: string;
        test_name: string;
        status: string;
        result: { hasil: string; catatan: string | null } | null;
    }[];
}

interface PatientHistoryProps {
    patientName: string;
    patientRM: string;
    visits: Visit[];
    currentVisitId?: string;
}

const INITIAL_SHOW_COUNT = 5;

export function PatientHistory({ patientName, patientRM, visits, currentVisitId }: PatientHistoryProps) {
    const [expandedVisit, setExpandedVisit] = useState<string | null>(null);
    const [showAll, setShowAll] = useState(false);

    const previousVisits = visits.filter(v => v.id !== currentVisitId);

    // Show only latest 5 or all based on state
    const visibleVisits = showAll
        ? previousVisits
        : previousVisits.slice(0, INITIAL_SHOW_COUNT);

    const hasMore = previousVisits.length > INITIAL_SHOW_COUNT;

    if (previousVisits.length === 0) {
        return (
            <Card className="bg-slate-50">
                <CardContent className="py-6 text-center text-slate-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Ini adalah kunjungan pertama pasien</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                    <FileText className="w-5 h-5" />
                    Riwayat Kunjungan Sebelumnya
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-sm font-normal">
                        {previousVisits.length} kunjungan
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {visibleVisits.map((visit) => (
                    <div key={visit.id} className="border rounded-lg overflow-hidden">
                        <button
                            onClick={() => setExpandedVisit(expandedVisit === visit.id ? null : visit.id)}
                            className="w-full px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 transition-colors"
                        >
                            <div className="flex items-center gap-4 text-left">
                                <div>
                                    <p className="font-medium">
                                        {new Date(visit.tanggal).toLocaleDateString("id-ID", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric",
                                        })}
                                    </p>
                                    <p className="text-sm text-slate-500">
                                        Poli {visit.poli.charAt(0).toUpperCase() + visit.poli.slice(1)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="flex gap-1">
                                    {visit.soap_note && <Stethoscope className="w-4 h-4 text-blue-500" />}
                                    {visit.prescriptions.length > 0 && <Pill className="w-4 h-4 text-green-500" />}
                                    {visit.lab_requests.length > 0 && <FlaskConical className="w-4 h-4 text-purple-500" />}
                                </div>
                                {expandedVisit === visit.id ? (
                                    <ChevronUp className="w-5 h-5 text-slate-400" />
                                ) : (
                                    <ChevronDown className="w-5 h-5 text-slate-400" />
                                )}
                            </div>
                        </button>

                        {expandedVisit === visit.id && (
                            <div className="px-4 py-4 bg-slate-50 border-t space-y-4">
                                {/* SOAP */}
                                {visit.soap_note && (
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                            <Stethoscope className="w-4 h-4" /> SOAP
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            <div className="bg-white p-2 rounded border">
                                                <span className="font-medium text-slate-500">S:</span> {visit.soap_note.subjective || "-"}
                                            </div>
                                            <div className="bg-white p-2 rounded border">
                                                <span className="font-medium text-slate-500">O:</span> {visit.soap_note.objective || "-"}
                                            </div>
                                            <div className="bg-white p-2 rounded border">
                                                <span className="font-medium text-slate-500">A:</span> {visit.soap_note.assessment || "-"}
                                            </div>
                                            <div className="bg-white p-2 rounded border">
                                                <span className="font-medium text-slate-500">P:</span> {visit.soap_note.plan || "-"}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Diagnoses */}
                                {visit.diagnoses.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2">Diagnosa</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {visit.diagnoses.map((d) => (
                                                <span key={d.id} className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                                                    {d.icd_code} {d.description && `- ${d.description}`}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Prescriptions */}
                                {visit.prescriptions.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                            <Pill className="w-4 h-4" /> Resep
                                        </h4>
                                        {visit.prescriptions.map((rx) => (
                                            <div key={rx.id} className="bg-white p-2 rounded border text-sm">
                                                {rx.items.map((item) => (
                                                    <div key={item.id} className="flex justify-between py-1 border-b last:border-0">
                                                        <span>{item.nama_obat}</span>
                                                        <span className="text-slate-500">{item.aturan} • {item.jumlah}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Lab Results */}
                                {visit.lab_requests.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                                            <FlaskConical className="w-4 h-4" /> Hasil Lab
                                        </h4>
                                        <div className="space-y-1">
                                            {visit.lab_requests.map((lab) => (
                                                <div key={lab.id} className="bg-white p-2 rounded border text-sm flex justify-between">
                                                    <span className="font-medium">{lab.test_name}</span>
                                                    <span className={lab.result ? "text-green-600" : "text-slate-400"}>
                                                        {lab.result ? lab.result.hasil : "Belum ada hasil"}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {/* Load more / Show less button */}
                {hasMore && (
                    <div className="text-center pt-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowAll(!showAll)}
                            className="text-blue-600 hover:text-blue-700"
                        >
                            {showAll
                                ? `Sembunyikan (tampilkan ${INITIAL_SHOW_COUNT} terakhir)`
                                : `Lihat Semua Riwayat (${previousVisits.length - INITIAL_SHOW_COUNT} lagi)`}
                        </Button>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
