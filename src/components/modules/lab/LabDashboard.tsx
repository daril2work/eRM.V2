"use client";

import { CardRM } from "@/components/modules/shared/CardRM";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";

interface LabRequest {
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
    test_name: string;
    status: string;
}

interface LabDashboardProps {
    waiting: LabRequest[];
    finished: LabRequest[];
}

export function LabDashboard({ waiting, finished }: LabDashboardProps) {
    const router = useRouter();

    const calculateAge = (dob: Date) => {
        const diff = Date.now() - new Date(dob).getTime();
        const ageDate = new Date(diff);
        return Math.abs(ageDate.getUTCFullYear() - 1970);
    }

    const handleProcess = (id: string) => {
        router.push(`/lab/${id}`);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Laboratorium</h1>
                <div className="bg-slate-100 p-2 rounded text-sm text-slate-500">
                    Antrian Lab: {waiting.length}
                </div>
            </div>

            <Tabs defaultValue="waiting" className="w-full">
                <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto bg-transparent">
                    <TabsTrigger value="waiting" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-4 py-2">
                        Permintaan Masuk ({waiting.length})
                    </TabsTrigger>
                    <TabsTrigger value="finished" className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent px-4 py-2">
                        Selesai ({finished.length})
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="waiting" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {waiting.map((item) => (
                            <CardRM
                                key={item.id}
                                patientName={item.visit.patient.nama}
                                noRM={item.visit.patient.no_rm}
                                age={calculateAge(item.visit.patient.tanggal_lahir)}
                                gender={item.visit.patient.gender}
                                poli={item.visit.poli}
                                status={item.status} // "menunggu"
                                onProcess={() => handleProcess(item.id)}
                            />
                        ))}
                        {waiting.length === 0 && <p className="text-slate-500">Tidak ada permintaan baru.</p>}
                    </div>
                </TabsContent>

                <TabsContent value="finished" className="pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {finished.map((item) => (
                            <CardRM
                                key={item.id}
                                patientName={item.visit.patient.nama}
                                noRM={item.visit.patient.no_rm}
                                age={calculateAge(item.visit.patient.tanggal_lahir)}
                                gender={item.visit.patient.gender}
                                poli={item.visit.poli}
                                status={item.status}
                            />
                        ))}
                        {finished.length === 0 && <p className="text-slate-500">Belum ada riwayat.</p>}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
