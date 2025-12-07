import { getLabRequests } from "@/app/actions/lab";
import { LabDashboard } from "@/components/modules/lab/LabDashboard";

export default async function LabPage() {
    const waiting = await getLabRequests("menunggu");
    const finished = await getLabRequests("selesai");

    return (
        <div className="container mx-auto py-8">
            <LabDashboard waiting={waiting} finished={finished} />
        </div>
    );
}
