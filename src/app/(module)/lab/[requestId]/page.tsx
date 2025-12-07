import { getLabRequestDetail } from "@/app/actions/lab";
import { LabResultForm } from "@/components/modules/lab/LabResultForm";
import { notFound } from "next/navigation";

export default async function LabRequestPage({ params }: { params: Promise<{ requestId: string }> }) {
    const { requestId } = await params;
    const request = await getLabRequestDetail(requestId);

    if (!request) return notFound();

    return (
        <div className="container mx-auto py-8 max-w-3xl">
            <h1 className="text-2xl font-bold mb-4">Input Hasil Laboratorium</h1>

            <div className="bg-white p-6 rounded-lg border shadow-sm">
                <div className="border-b pb-4 mb-4">
                    <h2 className="text-xl font-semibold">{request.test_name}</h2>
                    <p className="text-gray-500">{request.visit.patient.nama} ({request.visit.patient.no_rm})</p>
                </div>

                {request.status === 'selesai' ? (
                    <div className="bg-green-50 p-4 rounded border border-green-200">
                        <p className="font-semibold text-green-800">Pemeriksaan Selesai</p>
                        <div className="mt-2">
                            <p className="text-sm text-gray-600">Hasil:</p>
                            <p className="font-mono bg-white p-2 rounded border">{request.result?.hasil}</p>
                        </div>
                    </div>
                ) : (
                    <LabResultForm requestId={requestId} />
                )}
            </div>
        </div>
    );
}
