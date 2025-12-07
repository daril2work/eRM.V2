"use client";

import { createSickLetter, deleteSickLetter } from "@/app/actions/sickLetter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Printer, Trash2 } from "lucide-react";
import { useState } from "react";

interface Patient {
    nama: string;
    no_rm: string;
    tanggal_lahir: Date;
    gender: string;
    alamat: string;
}

interface Diagnosis {
    icd_code: string;
    description: string | null;
}

interface SickLetterData {
    id: string;
    nomor_surat: string;
    tanggal_mulai: Date;
    jumlah_hari: number;
    keterangan: string | null;
    created_at: Date;
}

interface SickLetterFormProps {
    visitId: string;
    patient: Patient;
    diagnoses: Diagnosis[];
    existingLetter?: SickLetterData | null;
}

export function SickLetterForm({ visitId, patient, diagnoses, existingLetter }: SickLetterFormProps) {
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [letter, setLetter] = useState<SickLetterData | null>(existingLetter || null);

    const handleCreate = async (formData: FormData) => {
        setLoading(true);

        const result = await createSickLetter({
            visitId,
            tanggalMulai: new Date(formData.get("tanggalMulai") as string),
            jumlahHari: parseInt(formData.get("jumlahHari") as string),
            keterangan: formData.get("keterangan") as string || undefined,
        });

        if (result.success && result.sickLetter) {
            setLetter(result.sickLetter);
            setShowForm(false);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!confirm("Hapus surat sakit ini?")) return;
        setLoading(true);
        await deleteSickLetter(visitId);
        setLetter(null);
        setLoading(false);
    };

    const handlePrint = () => {
        if (!letter) return;

        const tanggalMulai = new Date(letter.tanggal_mulai);
        const tanggalSelesai = new Date(tanggalMulai);
        tanggalSelesai.setDate(tanggalSelesai.getDate() + letter.jumlah_hari - 1);

        const age = new Date().getFullYear() - new Date(patient.tanggal_lahir).getFullYear();
        const diagnosisText = diagnoses.map(d => `${d.icd_code}${d.description ? ` - ${d.description}` : ""}`).join(", ") || "-";

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Surat Keterangan Sakit - ${patient.nama}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: "Times New Roman", serif; padding: 40px 60px; font-size: 12pt; line-height: 1.6; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #000; padding-bottom: 20px; }
          .clinic-name { font-size: 18pt; font-weight: bold; }
          .clinic-info { font-size: 10pt; color: #333; }
          .title { text-align: center; margin: 30px 0; }
          .title h2 { text-decoration: underline; font-size: 14pt; }
          .nomor { text-align: center; font-size: 10pt; margin-bottom: 20px; }
          .content { text-align: justify; margin-bottom: 30px; }
          .content p { margin-bottom: 15px; text-indent: 40px; }
          .patient-info { margin: 20px 0; }
          .patient-info table { margin-left: 40px; }
          .patient-info td { padding: 3px 10px; vertical-align: top; }
          .patient-info td:first-child { width: 150px; }
          .signature { margin-top: 50px; text-align: right; }
          .signature-box { display: inline-block; text-align: center; width: 250px; }
          .signature-space { height: 80px; }
          @media print {
            body { padding: 20px 40px; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="clinic-name">eRM KLINIK</div>
          <div class="clinic-info">Jl. Contoh Alamat No. 123, Kota</div>
          <div class="clinic-info">Telp: (021) 1234567</div>
        </div>

        <div class="title">
          <h2>SURAT KETERANGAN SAKIT</h2>
        </div>
        <div class="nomor">Nomor: ${letter.nomor_surat}</div>

        <div class="content">
          <p>Yang bertanda tangan di bawah ini, Dokter pada eRM Klinik, menerangkan bahwa:</p>
          
          <div class="patient-info">
            <table>
              <tr><td>Nama</td><td>: ${patient.nama}</td></tr>
              <tr><td>No. Rekam Medis</td><td>: ${patient.no_rm}</td></tr>
              <tr><td>Umur</td><td>: ${age} Tahun</td></tr>
              <tr><td>Jenis Kelamin</td><td>: ${patient.gender === "L" ? "Laki-laki" : "Perempuan"}</td></tr>
              <tr><td>Alamat</td><td>: ${patient.alamat || "-"}</td></tr>
            </table>
          </div>

          <p>Berdasarkan hasil pemeriksaan, yang bersangkutan dinyatakan <strong>SAKIT</strong> dan memerlukan istirahat selama <strong>${letter.jumlah_hari} (${toWords(letter.jumlah_hari)}) hari</strong>, terhitung mulai tanggal <strong>${formatDate(tanggalMulai)}</strong> sampai dengan tanggal <strong>${formatDate(tanggalSelesai)}</strong>.</p>

          ${letter.keterangan ? `<p>Keterangan: ${letter.keterangan}</p>` : ""}
          ${diagnosisText !== "-" ? `<p>Diagnosa: ${diagnosisText}</p>` : ""}

          <p>Demikian surat keterangan ini dibuat untuk dipergunakan sebagaimana mestinya.</p>
        </div>

        <div class="signature">
          <div class="signature-box">
            <p>${formatDate(new Date(letter.created_at))}</p>
            <p>Dokter Pemeriksa,</p>
            <div class="signature-space"></div>
            <p>(_______________________)</p>
          </div>
        </div>
      </body>
      </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => printWindow.print(), 250);
    };

    if (letter) {
        return (
            <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-2">
                    <CardTitle className="text-green-700 flex items-center gap-2 text-base">
                        <FileText className="w-5 h-5" />
                        Surat Keterangan Sakit
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="font-mono text-sm">{letter.nomor_surat}</p>
                            <p className="text-sm text-slate-600">
                                {letter.jumlah_hari} hari istirahat mulai {formatDate(new Date(letter.tanggal_mulai))}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={handlePrint}>
                                <Printer className="w-4 h-4 mr-1" /> Cetak
                            </Button>
                            <Button size="sm" variant="outline" onClick={handleDelete} disabled={loading} className="text-red-600 hover:bg-red-50">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!showForm) {
        return (
            <Button variant="outline" onClick={() => setShowForm(true)} className="gap-2">
                <FileText className="w-4 h-4" />
                Buat Surat Sakit
            </Button>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="w-5 h-5" />
                    Buat Surat Keterangan Sakit
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form action={handleCreate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="tanggalMulai">Tanggal Mulai Istirahat</Label>
                            <Input
                                id="tanggalMulai"
                                name="tanggalMulai"
                                type="date"
                                required
                                defaultValue={new Date().toISOString().slice(0, 10)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="jumlahHari">Jumlah Hari</Label>
                            <Input
                                id="jumlahHari"
                                name="jumlahHari"
                                type="number"
                                min="1"
                                max="30"
                                required
                                defaultValue="1"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="keterangan">Keterangan (Opsional)</Label>
                        <Textarea
                            id="keterangan"
                            name="keterangan"
                            placeholder="Keterangan tambahan..."
                            rows={2}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                            {loading ? "Menyimpan..." : "Simpan & Buat Surat"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                            Batal
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

function formatDate(date: Date): string {
    return date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });
}

function toWords(num: number): string {
    const words = ["", "satu", "dua", "tiga", "empat", "lima", "enam", "tujuh", "delapan", "sembilan", "sepuluh",
        "sebelas", "dua belas", "tiga belas", "empat belas", "lima belas", "enam belas", "tujuh belas",
        "delapan belas", "sembilan belas", "dua puluh", "dua puluh satu", "dua puluh dua", "dua puluh tiga",
        "dua puluh empat", "dua puluh lima", "dua puluh enam", "dua puluh tujuh", "dua puluh delapan",
        "dua puluh sembilan", "tiga puluh"];
    return words[num] || num.toString();
}
