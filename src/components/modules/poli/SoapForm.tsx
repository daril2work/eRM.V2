"use client";

import { saveSoap } from "@/app/actions/poli";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface SoapFormProps {
    visitId: string;
    initialData?: { subjective: string; objective: string; assessment: string; plan: string } | null;
}

export function SoapForm({ visitId, initialData }: SoapFormProps) {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const data = {
            subjective: formData.get("subjective") as string,
            objective: formData.get("objective") as string,
            assessment: formData.get("assessment") as string,
            plan: formData.get("plan") as string,
        };

        await saveSoap(visitId, data);
        setLoading(false);
        setMessage("SOAP tersimpan!");
        setTimeout(() => setMessage(""), 3000);
    }

    return (
        <form action={handleSubmit} className="space-y-4">
            {message && <div className="text-green-600 font-medium text-sm">{message}</div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="subjective">Subjective (Keluhan)</Label>
                    <Textarea id="subjective" name="subjective" defaultValue={initialData?.subjective} required className="min-h-[120px]" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="objective">Objective (Pemeriksaan Fisik)</Label>
                    <Textarea id="objective" name="objective" defaultValue={initialData?.objective} required className="min-h-[120px]" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="assessment">Assessment (Diagnosa Kerja)</Label>
                    <Textarea id="assessment" name="assessment" defaultValue={initialData?.assessment} required className="min-h-[100px]" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="plan">Plan (Rencana / Tindakan)</Label>
                    <Textarea id="plan" name="plan" defaultValue={initialData?.plan} required className="min-h-[100px]" />
                </div>
            </div>
            <Button type="submit" disabled={loading}>Simpan SOAP</Button>
        </form>
    );
}
