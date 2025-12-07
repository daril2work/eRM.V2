"use client";

import { Button } from "@/components/ui/button";
import { Printer } from "lucide-react";
import { useRef } from "react";

interface LabelItem {
    id: string;
    nama_obat: string;
    aturan: string;
    jumlah: number;
}

interface PrintLabelProps {
    patientName: string;
    patientRM: string;
    items: LabelItem[];
}

export function PrintLabelButton({ patientName, patientRM, items }: PrintLabelProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Etiket Obat - ${patientName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; padding: 10mm; }
          .label { 
            border: 2px solid #000; 
            padding: 8mm; 
            margin-bottom: 5mm; 
            page-break-inside: avoid;
            width: 80mm;
          }
          .header { 
            text-align: center; 
            border-bottom: 1px solid #000; 
            padding-bottom: 3mm; 
            margin-bottom: 3mm;
          }
          .clinic-name { font-weight: bold; font-size: 14pt; }
          .patient-info { font-size: 10pt; margin: 2mm 0; }
          .drug-name { font-weight: bold; font-size: 12pt; margin: 3mm 0; }
          .dosage { font-size: 11pt; background: #f0f0f0; padding: 2mm; border-radius: 2mm; }
          .qty { font-size: 10pt; margin-top: 2mm; }
          .footer { font-size: 8pt; text-align: center; margin-top: 3mm; color: #666; }
          @media print {
            body { padding: 0; }
            .label { margin: 3mm; }
          }
        </style>
      </head>
      <body>
        ${items.map(item => `
          <div class="label">
            <div class="header">
              <div class="clinic-name">eRM Klinik</div>
            </div>
            <div class="patient-info">
              <strong>${patientName}</strong><br/>
              No. RM: ${patientRM}
            </div>
            <div class="drug-name">${item.nama_obat}</div>
            <div class="dosage">${item.aturan}</div>
            <div class="qty">Jumlah: ${item.jumlah}</div>
            <div class="footer">Simpan di tempat kering dan sejuk</div>
          </div>
        `).join('')}
      </body>
      </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        setTimeout(() => {
            printWindow.print();
        }, 250);
    };

    return (
        <>
            <Button
                type="button"
                variant="outline"
                onClick={handlePrint}
                className="gap-2"
            >
                <Printer className="w-4 h-4" />
                Cetak Etiket
            </Button>
            <div ref={printRef} className="hidden" />
        </>
    );
}
