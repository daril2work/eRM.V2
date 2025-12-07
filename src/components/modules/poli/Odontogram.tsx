"use client";

import { saveDentalRecord, deleteDentalRecord } from "@/app/actions/dental";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

interface DentalRecord {
    id: string;
    tooth_num: string;
    condition: string;
    notes: string | null;
}

interface OdontogramProps {
    visitId: string;
    initialRecords?: DentalRecord[];
}

const CONDITIONS = [
    { value: "normal", label: "Normal", color: "bg-green-500" },
    { value: "caries", label: "Karies", color: "bg-red-500" },
    { value: "missing", label: "Missing", color: "bg-gray-400" },
    { value: "filling", label: "Tambalan", color: "bg-blue-500" },
    { value: "crown", label: "Mahkota", color: "bg-yellow-500" },
    { value: "root_canal", label: "Perawatan Saluran Akar", color: "bg-purple-500" },
    { value: "extraction", label: "Perlu Cabut", color: "bg-orange-500" },
];

// FDI notation - Adult teeth
const UPPER_RIGHT = ["18", "17", "16", "15", "14", "13", "12", "11"];
const UPPER_LEFT = ["21", "22", "23", "24", "25", "26", "27", "28"];
const LOWER_LEFT = ["31", "32", "33", "34", "35", "36", "37", "38"];
const LOWER_RIGHT = ["48", "47", "46", "45", "44", "43", "42", "41"];

export function Odontogram({ visitId, initialRecords = [] }: OdontogramProps) {
    const [records, setRecords] = useState<Record<string, string>>(
        Object.fromEntries(initialRecords.map((r) => [r.tooth_num, r.condition]))
    );
    const [selectedTooth, setSelectedTooth] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const getToothColor = (toothNum: string) => {
        const condition = records[toothNum];
        if (!condition || condition === "normal") return "bg-white hover:bg-gray-100";
        const cond = CONDITIONS.find((c) => c.value === condition);
        return cond ? `${cond.color} text-white` : "bg-white";
    };

    const handleToothClick = (toothNum: string) => {
        setSelectedTooth(toothNum);
    };

    const handleConditionSelect = async (condition: string) => {
        if (!selectedTooth) return;

        setSaving(true);

        if (condition === "normal") {
            // Remove the record if setting to normal
            await deleteDentalRecord(visitId, selectedTooth);
            const newRecords = { ...records };
            delete newRecords[selectedTooth];
            setRecords(newRecords);
        } else {
            await saveDentalRecord(visitId, selectedTooth, condition);
            setRecords({ ...records, [selectedTooth]: condition });
        }

        setSaving(false);
        setMessage(`Gigi ${selectedTooth} disimpan`);
        setTimeout(() => setMessage(""), 2000);
        setSelectedTooth(null);
    };

    const ToothButton = ({ num }: { num: string }) => (
        <button
            onClick={() => handleToothClick(num)}
            className={`w-10 h-12 border-2 rounded-lg font-bold text-xs transition-all ${selectedTooth === num
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : ""
                } ${getToothColor(num)}`}
        >
            {num}
        </button>
    );

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between">
                    <span>Odontogram</span>
                    {message && <span className="text-sm font-normal text-green-600">{message}</span>}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Legend */}
                <div className="flex flex-wrap gap-2 text-xs">
                    {CONDITIONS.map((c) => (
                        <div key={c.value} className="flex items-center gap-1">
                            <div className={`w-3 h-3 rounded ${c.color}`} />
                            <span>{c.label}</span>
                        </div>
                    ))}
                </div>

                {/* Dental Chart */}
                <div className="bg-slate-50 p-4 rounded-lg">
                    {/* Upper Jaw */}
                    <div className="flex justify-center gap-1 mb-1">
                        <div className="flex gap-1">
                            {UPPER_RIGHT.map((n) => <ToothButton key={n} num={n} />)}
                        </div>
                        <div className="w-4" /> {/* Center gap */}
                        <div className="flex gap-1">
                            {UPPER_LEFT.map((n) => <ToothButton key={n} num={n} />)}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="flex justify-center my-2">
                        <div className="border-t-2 border-slate-300 w-full max-w-md flex items-center justify-center">
                            <span className="bg-slate-50 px-2 text-xs text-slate-400">Rahang</span>
                        </div>
                    </div>

                    {/* Lower Jaw */}
                    <div className="flex justify-center gap-1">
                        <div className="flex gap-1">
                            {LOWER_RIGHT.map((n) => <ToothButton key={n} num={n} />)}
                        </div>
                        <div className="w-4" /> {/* Center gap */}
                        <div className="flex gap-1">
                            {LOWER_LEFT.map((n) => <ToothButton key={n} num={n} />)}
                        </div>
                    </div>
                </div>

                {/* Condition Selector */}
                {selectedTooth && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="font-semibold mb-3">
                            Pilih kondisi gigi <span className="text-blue-600">{selectedTooth}</span>:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {CONDITIONS.map((c) => (
                                <Button
                                    key={c.value}
                                    size="sm"
                                    variant={records[selectedTooth] === c.value ? "default" : "outline"}
                                    onClick={() => handleConditionSelect(c.value)}
                                    disabled={saving}
                                    className={records[selectedTooth] === c.value ? c.color : ""}
                                >
                                    {c.label}
                                </Button>
                            ))}
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setSelectedTooth(null)}
                                disabled={saving}
                            >
                                Batal
                            </Button>
                        </div>
                    </div>
                )}

                {/* Summary */}
                {Object.keys(records).length > 0 && (
                    <div className="text-sm text-slate-600">
                        <strong>Catatan:</strong>{" "}
                        {Object.entries(records).map(([tooth, cond]) => {
                            const condLabel = CONDITIONS.find((c) => c.value === cond)?.label || cond;
                            return `${tooth}: ${condLabel}`;
                        }).join(", ")}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
