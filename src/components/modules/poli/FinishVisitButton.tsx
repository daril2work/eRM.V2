"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import { checkVisitStatus } from "@/app/actions/poli";

interface FinishVisitButtonProps {
    visitId: string;
    poli: string;
    onFinish: () => Promise<void>;
}

export function FinishVisitButton({
    visitId,
    poli,
    onFinish,
}: FinishVisitButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(false);
    const [warnings, setWarnings] = useState<string[]>([]);

    const handleClick = async () => {
        setChecking(true);

        // Fetch real-time status from database
        const status = await checkVisitStatus(visitId);

        const newWarnings: string[] = [];

        if (!status.hasPrescription) {
            newWarnings.push("Anda belum meresepkan obat untuk pasien ini.");
        }
        if (!status.hasLabRequest) {
            newWarnings.push("Anda belum membuat permintaan pemeriksaan lab.");
        }

        setChecking(false);

        if (newWarnings.length > 0) {
            setWarnings(newWarnings);
            setShowModal(true);
        } else {
            handleConfirm();
        }
    };

    const handleConfirm = async () => {
        setLoading(true);
        await onFinish();
    };

    const handleCancel = () => {
        setShowModal(false);
        setWarnings([]);
    };

    return (
        <>
            <Button
                type="button"
                size="lg"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleClick}
                disabled={loading || checking}
            >
                {checking ? "Memeriksa..." : loading ? "Memproses..." : "Selesaikan Pemeriksaan & Pulangkan"}
            </Button>

            {/* Confirmation Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={handleCancel}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    Konfirmasi Selesai Pemeriksaan
                                </h3>
                                <div className="space-y-2 mb-4">
                                    {warnings.map((warning, idx) => (
                                        <p key={idx} className="text-sm text-slate-600">
                                            • {warning}
                                        </p>
                                    ))}
                                </div>
                                <p className="text-sm text-slate-500 mb-4">
                                    Apakah Anda yakin ingin menyelesaikan pemeriksaan?
                                </p>
                                <div className="flex gap-3 justify-end">
                                    <Button
                                        variant="outline"
                                        onClick={handleCancel}
                                        disabled={loading}
                                    >
                                        Batal
                                    </Button>
                                    <Button
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={handleConfirm}
                                        disabled={loading}
                                    >
                                        {loading ? "Memproses..." : "Ya, Selesaikan"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
