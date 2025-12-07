import { getVisitsByPoli } from "@/app/actions/poli";
import { PoliDashboard } from "@/components/modules/poli/PoliDashboard";

interface PageProps {
    params: Promise<{ tipe: string }>;
}

export default async function PoliPage({ params }: PageProps) {
    // Await the params object
    const { tipe } = await params;

    // tipe should be 'umum' or 'gigi' ideally, but we handle string
    const waitingVisits = await getVisitsByPoli(tipe, "menunggu");
    const finishedVisits = await getVisitsByPoli(tipe, "selesai");

    return (
        <div className="container mx-auto py-8">
            <PoliDashboard
                tipe={tipe}
                waitingVisits={waitingVisits}
                finishedVisits={finishedVisits}
            />
        </div>
    );
}
