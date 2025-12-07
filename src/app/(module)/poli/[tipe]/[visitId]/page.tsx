import { finishVisit, getVisitDetail } from "@/app/actions/poli";
import { getPatientHistory } from "@/app/actions/patient";
import { getDentalRecords } from "@/app/actions/dental";
import { getSickLetter } from "@/app/actions/sickLetter";
import { requireAuth } from "@/app/actions/auth";
import { DiagnosisInput } from "@/components/modules/poli/DiagnosisInput";
import { LabRequestBuilder } from "@/components/modules/poli/LabRequestBuilder";
import { PrescriptionBuilder } from "@/components/modules/poli/PrescriptionBuilder";
import { SoapForm } from "@/components/modules/poli/SoapForm";
import { PatientHistory } from "@/components/modules/poli/PatientHistory";
import { Odontogram } from "@/components/modules/poli/Odontogram";
import { SickLetterForm } from "@/components/modules/poli/SickLetterForm";
import { FinishVisitButton } from "@/components/modules/poli/FinishVisitButton";
import { notFound, redirect } from "next/navigation";

export default async function VisitPage({ params }: { params: Promise<{ tipe: string; visitId: string }> }) {
    // Check if user is a doctor
    const user = await requireAuth();
    if (!["admin", "poli_umum", "poli_gigi"].includes(user.role)) {
        redirect("/");
    }

    const { tipe, visitId } = await params;
    const visit = await getVisitDetail(visitId);

    if (!visit) return notFound();

    // Get patient history for doctors
    const patientHistory = await getPatientHistory(visit.patient_id);

    // Get dental records if poli gigi
    const dentalRecords = tipe === "gigi" ? await getDentalRecords(visitId) : [];

    // Get existing sick letter
    const sickLetter = await getSickLetter(visitId);

    async function handleFinish() {
        "use server";
        await finishVisit(visitId, tipe);
        redirect(`/poli/${tipe}`);
    }

    // Calculate age
    const age = new Date().getFullYear() - visit.patient.tanggal_lahir.getFullYear();

    return (
        <div className="container mx-auto py-8 space-y-8 max-w-4xl">
            <div className="flex justify-between items-start border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold">
                        Poli {tipe.charAt(0).toUpperCase() + tipe.slice(1)}
                    </h1>
                    <p className="text-slate-500">Pemeriksaan Pasien</p>
                </div>
                <div className="text-right">
                    <h2 className="text-xl font-bold">{visit.patient.nama}</h2>
                    <p className="text-sm font-mono">{visit.patient.no_rm}</p>
                    <p className="text-sm text-slate-500">{visit.patient.gender === 'L' ? 'Laki-laki' : 'Perempuan'}, {age} Tahun</p>
                </div>
            </div>

            <div className="grid gap-8">
                {/* Patient Visit History Section - Only visible to doctors */}
                <section>
                    <PatientHistory
                        patientName={visit.patient.nama}
                        patientRM={visit.patient.no_rm}
                        visits={patientHistory?.visits || []}
                        currentVisitId={visitId}
                    />
                </section>

                {/* Odontogram - Only for Poli Gigi */}
                {tipe === "gigi" && (
                    <section>
                        <Odontogram visitId={visitId} initialRecords={dentalRecords} />
                    </section>
                )}

                <section>
                    <SoapForm visitId={visitId} initialData={visit.soap_note} />
                </section>

                <section>
                    <DiagnosisInput visitId={visitId} />
                </section>

                <section>
                    <div className="space-y-4">
                        <PrescriptionBuilder visitId={visitId} />
                        <LabRequestBuilder visitId={visitId} />
                    </div>
                </section>

                {/* Sick Letter Section */}
                <section>
                    <SickLetterForm
                        visitId={visitId}
                        patient={visit.patient}
                        diagnoses={visit.diagnoses}
                        existingLetter={sickLetter}
                    />
                </section>

                <section className="pt-8 border-t flex justify-end">
                    <FinishVisitButton
                        visitId={visitId}
                        poli={tipe}
                        onFinish={handleFinish}
                    />
                </section>
            </div>
        </div>
    );
}
