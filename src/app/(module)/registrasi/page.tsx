import { PatientForm } from "@/components/modules/registrasi/PatientForm";
import { PatientSearch } from "@/components/modules/registrasi/PatientSearch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function RegistrasiPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-6">Pendaftaran Pasien</h1>

            <Tabs defaultValue="search" className="w-full max-w-4xl">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                    <TabsTrigger value="search">Cari Pasien (Lama)</TabsTrigger>
                    <TabsTrigger value="register">Registrasi Pasien Baru</TabsTrigger>
                </TabsList>

                <TabsContent value="search">
                    <div className="p-4 border rounded-lg bg-white shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Cari & Daftar Antrian</h2>
                        <PatientSearch />
                    </div>
                </TabsContent>

                <TabsContent value="register">
                    <div className="p-4 border rounded-lg bg-white shadow-sm">
                        <PatientForm />
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
