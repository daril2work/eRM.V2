import { getMedicineById } from "@/app/actions/inventory";
import { StockUpdateForm } from "@/components/modules/farmasi/StockUpdateForm";
import { notFound } from "next/navigation";

export default async function StockUpdatePage({ params }: { params: Promise<{ medicineId: string }> }) {
    const { medicineId } = await params;
    const medicine = await getMedicineById(medicineId);

    if (!medicine) return notFound();

    return (
        <div className="max-w-xl">
            <h1 className="text-2xl font-bold mb-6">Update Stok Obat</h1>
            <StockUpdateForm medicine={medicine} />
        </div>
    );
}
