"use client";

import { CardRM } from "@/components/modules/shared/CardRM";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

// Define type based on what getPrescriptions returns
interface Prescription {
    id: string;
    visit: {
        patient: {
            nama: string;
            no_rm: string;
            tanggal_lahir: Date;
            gender: string;
        };
        poli: string;
    };
    status: string;
    items: any[];
}

interface PharmacyDashboardProps {
    waiting: Prescription[];
    finished: Prescription[];
}

export function PharmacyDashboard({ waiting, finished }: PharmacyDashboardProps) {
    const router = useRouter();

    const calculateAge = (dob: Date) => {
        const diff = Date.now() - new Date(dob).getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    const handleProcess = (id: string) => {
        router.push(`/farmasi/${id}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Instalasi Farmasi</h1>
                <div className="bg-slate-100 p-2 rounded text-sm text-slate-500">
                    Antrian Resep: {waiting.length}
                </div>
            </div>

            <Tabs defaultValue="waiting" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto bg-transparent">
                    <TabsTrigger value="waiting" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-4 py-2">
                        Resep Masuk ({waiting.length})
                    </TabsTrigger>
                    <TabsTrigger value="finished" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-4 py-2">
                        Selesai / Diserahkan ({finished.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="waiting" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {waiting.map((p) => (
                            <CardRM
                                key={p.id}
                                patientName={p.visit.patient.nama}
                                noRM={p.visit.patient.no_rm}
                                age={calculateAge(p.visit.patient.tanggal_lahir)}
                                gender={p.visit.patient.gender}
                                poli={p.visit.poli}
                                status={p.status}
                                onProcess={() => handleProcess(p.id)}
                            />
                        ))}
                        {waiting.length === 0 && <p className="text-slate-500">Tidak ada resep baru.</p>}
                    </div>
                </TabsContent>

                <TabsContent value="finished" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {finished.map((p) => (
                            <CardRM
                                key={p.id}
                                patientName={p.visit.patient.nama}
                                noRM={p.visit.patient.no_rm}
                                age={calculateAge(p.visit.patient.tanggal_lahir)}
                                gender={p.visit.patient.gender}
                                poli={p.visit.poli}
                                status={p.status}
                            />
                        ))}
                        {finished.length === 0 && <p className="text-slate-500">Belum ada riwayat.</p>}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
