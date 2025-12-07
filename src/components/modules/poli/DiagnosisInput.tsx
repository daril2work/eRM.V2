"use client";

import { addDiagnosis } from "@/app/actions/poli";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

interface DiagnosisInputProps {
    visitId: string;
}

export function DiagnosisInput({ visitId }: DiagnosisInputProps) {
    const [icd, setIcd] = useState("");
    const [desc, setDesc] = useState("");
    const [loading, setLoading] = useState(false);
    const [added, setAdded] = useState<string[]>([]);

    async function handleAdd() {
        if (!icd) return;
        setLoading(true);
        await addDiagnosis(visitId, icd, desc);
        setAdded([...added, `${icd} - ${desc}`]);
        setIcd("");
        setDesc("");
        setLoading(false);
    }

    return (
        <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-semibold text-lg">Diagnosa (ICD-10)</h3>
            <div className="flex gap-2">
                <div className="w-24">
                    <Label>Kode ICD</Label>
                    <Input value={icd} onChange={(e) => setIcd(e.target.value)} placeholder="A00" />
                </div>
                <div className="flex-1">
                    <Label>Keterangan</Label>
                    <Input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Deskripsi diagnosa" />
                </div>
                <div className="flex items-end">
                    <Button onClick={handleAdd} disabled={loading}>Tambah</Button>
                </div>
            </div>

            <ul className="list-disc list-inside text-sm text-slate-700">
                {added.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
        </div>
    );
}
