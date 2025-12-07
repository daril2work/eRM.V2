"use client";

import { submitLabResult } from "@/app/actions/lab";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LabResultFormProps {
    requestId: string;
}

export function LabResultForm({ requestId }: LabResultFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        const hasil = formData.get("hasil") as string;
        const catatan = formData.get("catatan") as string;

        await submitLabResult(requestId, hasil, catatan);
        setLoading(false);
        router.push("/lab");
    }

    return (
        <form action={handleSubmit} className="space-y-4 max-w-lg mt-4 border p-4 rounded-md bg-white">
            <div className="space-y-2">
                <Label htmlFor="hasil">Hasil Pemeriksaan</Label>
                <Textarea id="hasil" name="hasil" required className="min-h-[100px]" placeholder="Masukkan hasil lab..." />
            </div>

            <div className="space-y-2">
                <Label htmlFor="catatan">Catatan / Interpretasi</Label>
                <Input id="catatan" name="catatan" placeholder="Optional" />
            </div>

            <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan & Selesaikan"}
            </Button>
        </form>
    );
}
