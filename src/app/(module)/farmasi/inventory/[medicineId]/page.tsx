import { getMedicineById } from "@/app/actions/inventory";
import { MedicineEditForm } from "@/components/modules/farmasi/MedicineEditForm";
import { notFound } from "next/navigation";

export default async function MedicineDetailPage({ params }: { params: Promise<{ medicineId: string }> }) {
    const { medicineId } = await params;
    const medicine = await getMedicineById(medicineId);

    if (!medicine) return notFound();

    return (
        <div className="max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Detail Obat</h1>
            <MedicineEditForm medicine={medicine} />
        </div>
    );
}
