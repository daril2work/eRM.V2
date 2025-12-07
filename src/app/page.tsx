import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Beaker, FileText, Pill, Users } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const modules = [
    {
      title: "Pendaftaran",
      description: "Registrasi pasien baru & lama",
      href: "/registrasi",
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Poli Umum",
      description: "Pemeriksaan & pengobatan umum",
      href: "/poli/umum",
      icon: Activity,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Poli Gigi",
      description: "Pemeriksaan gigi & mulut",
      href: "/poli/gigi",
      icon: Activity,
      color: "text-teal-600",
      bg: "bg-teal-100",
    },
    {
      title: "Farmasi",
      description: "Pengambilan obat & resep",
      href: "/farmasi",
      icon: Pill,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "Laboratorium",
      description: "Pemeriksaan lab & hasil",
      href: "/lab",
      icon: Beaker,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">eRM Klinik Digital</h1>
          <p className="text-lg text-slate-600">Sistem Rekam Medis Elektronik Terintegrasi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
          {modules.map((m) => (
            <Link key={m.title} href={m.href} className="group transition-transform hover:-translate-y-1 block">
              <Card className="h-full border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4 pb-2">
                  <div className={`p-3 rounded-xl ${m.bg}`}>
                    <m.icon className={`w-8 h-8 ${m.color}`} />
                  </div>
                  <div>
                    <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">{m.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{m.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
