"use client";

import { saveLabRequest } from "@/app/actions/poli";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";

const COMMON_TESTS = [
    "Darah Lengkap", "Urine Lengkap", "Gula Darah Sewaktu",
    "Gula Darah Puasa", "Cholesterol", "Asam Urat", "Widal"
];

interface LabRequestBuilderProps {
    visitId: string;
}

export function LabRequestBuilder({ visitId }: LabRequestBuilderProps) {
    const [selectedTests, setSelectedTests] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const toggleTest = (test: string) => {
        if (selectedTests.includes(test)) {
            setSelectedTests(selectedTests.filter(t => t !== test));
        } else {
            setSelectedTests([...selectedTests, test]);
        }
    };

    async function handleSubmit() {
        if (selectedTests.length === 0) return;
        setLoading(true);
        await saveLabRequest(visitId, selectedTests);
        setLoading(false);
        setMessage("Permintaan Lab terkirim!");
        setSelectedTests([]);
        setTimeout(() => setMessage(""), 3000);
    }

    return (
        <div className="space-y-4 border p-4 rounded-md">
            <h3 className="font-semibold text-lg">Permintaan Laboratorium</h3>
            {message && <div className="text-green-600 text-sm">{message}</div>}

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {COMMON_TESTS.map((test) => (
                    <div key={test} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={test}
                            checked={selectedTests.includes(test)}
                            onChange={() => toggleTest(test)}
                            className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                        />
                        <Label htmlFor={test} className="cursor-pointer">{test}</Label>
                    </div>
                ))}
            </div>

            <Button onClick={handleSubmit} disabled={loading || selectedTests.length === 0}>
                {loading ? "Mengirim..." : "Kirim Permintaan Lab"}
            </Button>
        </div>
    );
}
