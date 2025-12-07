import { getPrescriptions } from "@/app/actions/farmasi";
import { PharmacyDashboard } from "@/components/modules/farmasi/PharmacyDashboard";

export default async function FarmasiPage() {
    const waiting = await getPrescriptions("menunggu");
    const finished = await getPrescriptions("selesai");

    return (
        <div className="container mx-auto py-8">
            <PharmacyDashboard waiting={waiting} finished={finished} />
        </div>
    );
}
