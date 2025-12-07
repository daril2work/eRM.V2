import { getPrescriptionDetail, processPrescription } from "@/app/actions/farmasi";
import { Button } from "@/components/ui/button";
import { PrintLabelButton } from "@/components/modules/farmasi/PrintLabelButton";
import { notFound, redirect } from "next/navigation";

export default async function ProcessPrescriptionPage({ params }: { params: Promise<{ prescriptionId: string }> }) {
    const { prescriptionId } = await params;
    const prescription = await getPrescriptionDetail(prescriptionId);

    if (!prescription) return notFound();

    async function handleProcess() {
        "use server";
        await processPrescription(prescriptionId);
        redirect("/farmasi");
    }

    return (
        <div className="container mx-auto py-8 max-w-3xl">
            <h1 className="text-2xl font-bold mb-4">Proses Resep</h1>

            <div className="bg-white p-6 rounded-lg border shadow-sm space-y-4">
                <div className="flex justify-between border-b pb-4">
                    <div>
                        <p className="font-semibold text-lg">{prescription.visit.patient.nama}</p>
                        <p className="text-gray-500">{prescription.visit.patient.no_rm}</p>
                    </div>
                    <div className="text-right">
                        <span className={`px-2 py-1 rounded text-sm font-semibold ${prescription.status === 'selesai'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {prescription.status}
                        </span>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-semibold">Daftar Obat:</h3>
                    <ul className="divide-y border rounded">
                        {prescription.items.map((item: any) => (
                            <li key={item.id} className="p-3 flex justify-between">
                                <div>
                                    <p className="font-medium">{item.nama_obat}</p>
                                    <p className="text-sm text-gray-500">{item.aturan}</p>
                                </div>
                                <div className="font-bold">Qty: {item.jumlah}</div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="pt-4 flex justify-between items-center">
                    <PrintLabelButton
                        patientName={prescription.visit.patient.nama}
                        patientRM={prescription.visit.patient.no_rm}
                        items={prescription.items}
                    />

                    {prescription.status === 'menunggu' && (
                        <form action={handleProcess}>
                            <Button className="bg-green-600 hover:bg-green-700">
                                Tandai Obat Diserahkan
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
