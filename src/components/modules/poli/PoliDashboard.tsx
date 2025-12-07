"use client";

import { CardRM } from "@/components/modules/shared/CardRM";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

// Define simplified type for what we need (or import Prisma type if available on client - usually better to define interface)
interface Visit {
    id: string;
    patient: {
        nama: string;
        no_rm: string;
        tanggal_lahir: Date;
        gender: string;
    };
    poli: string;
    status: string;
}

interface PoliDashboardProps {
    tipe: string;
    waitingVisits: Visit[];
    finishedVisits: Visit[];
}

export function PoliDashboard({ tipe, waitingVisits, finishedVisits }: PoliDashboardProps) {
    const router = useRouter();

    const calculateAge = (dob: Date) => {
        const diff = Date.now() - new Date(dob).getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    const handleProcess = (visitId: string) => {
        router.push(`/poli/${tipe}/${visitId}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold capitalize">Poli {tipe}</h1>
                <div className="bg-slate-100 p-2 rounded text-sm text-slate-500">
                    Antrian: {waitingVisits.length}
                </div>
            </div>

            <Tabs defaultValue="waiting" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto bg-transparent">
                    <TabsTrigger value="waiting" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-4 py-2">
                        Belum Dilayani ({waitingVisits.length})
                    </TabsTrigger>
                    <TabsTrigger value="finished" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-4 py-2">
                        Sudah Dilayani ({finishedVisits.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="waiting" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {waitingVisits.map((visit) => (
                            <CardRM
                                key={visit.id}
                                patientName={visit.patient.nama}
                                noRM={visit.patient.no_rm}
                                age={calculateAge(visit.patient.tanggal_lahir)}
                                gender={visit.patient.gender}
                                poli={visit.poli}
                                status={visit.status}
                                onProcess={() => handleProcess(visit.id)}
                            />
                        ))}
                        {waitingVisits.length === 0 && <p className="text-slate-500">Tidak ada antrian.</p>}
                    </div>
                </TabsContent>

                <TabsContent value="finished" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {finishedVisits.map((visit) => (
                            <CardRM
                                key={visit.id}
                                patientName={visit.patient.nama}
                                noRM={visit.patient.no_rm}
                                age={calculateAge(visit.patient.tanggal_lahir)}
                                gender={visit.patient.gender}
                                poli={visit.poli}
                                status={visit.status}
                            // No process button for finished, maybe "View"?
                            />
                        ))}
                        {finishedVisits.length === 0 && <p className="text-slate-500">Belum ada pasien selesai.</p>}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
