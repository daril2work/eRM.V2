import { getDashboardStats } from "@/app/actions/dashboard";
import { getCurrentUser } from "@/app/actions/auth";
import {
  Users,
  Activity,
  Clock,
  CheckCircle,
  Stethoscope,
  Pill,
  FlaskConical,
  UserPlus,
  ClipboardList,
  TrendingUp
} from "lucide-react";
import Link from "next/link";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">eRM Klinik</h1>
          <p className="text-slate-600">Silakan login untuk melanjutkan</p>
        </div>
      </div>
    );
  }

  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">
            Selamat datang, <span className="font-medium">{user.nama}</span>
          </p>
        </div>
        <div className="text-right text-sm text-slate-500">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </div>
      </div>

      {/* Quick Navigation Icons */}
      <div className="bg-white rounded-xl border p-4 shadow-sm">
        <div className="flex items-center justify-around">
          <QuickLink href="/registrasi" icon={UserPlus} label="Registrasi" color="blue" />
          <QuickLink href="/poli/umum" icon={Stethoscope} label="Poli Umum" color="green" />
          <QuickLink href="/poli/gigi" icon={Activity} label="Poli Gigi" color="teal" />
          <QuickLink href="/farmasi" icon={Pill} label="Farmasi" color="orange" />
          <QuickLink href="/lab" icon={FlaskConical} label="Lab" color="purple" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Kunjungan Hari Ini"
          value={stats.todayVisits}
          icon={ClipboardList}
          color="blue"
          subtitle={`${stats.newPatientsToday} pasien baru`}
        />
        <StatCard
          title="Menunggu Dilayani"
          value={stats.waitingVisits}
          icon={Clock}
          color="yellow"
          subtitle="Dalam antrian"
        />
        <StatCard
          title="Sedang Dilayani"
          value={stats.inProgressVisits}
          icon={Activity}
          color="orange"
          subtitle="Proses pemeriksaan"
        />
        <StatCard
          title="Selesai"
          value={stats.completedVisits}
          icon={CheckCircle}
          color="green"
          subtitle="Sudah pulang"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Poli Umum"
          value={stats.poliUmumVisits}
          icon={Stethoscope}
          color="emerald"
          subtitle="Kunjungan hari ini"
        />
        <StatCard
          title="Poli Gigi"
          value={stats.poliGigiVisits}
          icon={Activity}
          color="teal"
          subtitle="Kunjungan hari ini"
        />
        <StatCard
          title="Antrian Farmasi"
          value={stats.pharmacyQueue}
          icon={Pill}
          color="orange"
          subtitle="Resep menunggu"
        />
        <StatCard
          title="Antrian Lab"
          value={stats.labQueue}
          icon={FlaskConical}
          color="purple"
          subtitle="Sampel menunggu"
        />
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium opacity-90">Total Pasien Terdaftar</h3>
            <p className="text-4xl font-bold mt-1">{stats.totalPatients}</p>
            <p className="text-sm opacity-75 mt-2">
              +{stats.newPatientsToday} pasien baru hari ini
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <Users className="w-12 h-12" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  icon: Icon,
  label,
  color
}: {
  href: string;
  icon: any;
  label: string;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 text-blue-600 hover:bg-blue-200",
    green: "bg-green-100 text-green-600 hover:bg-green-200",
    teal: "bg-teal-100 text-teal-600 hover:bg-teal-200",
    orange: "bg-orange-100 text-orange-600 hover:bg-orange-200",
    purple: "bg-purple-100 text-purple-600 hover:bg-purple-200",
  };

  return (
    <Link href={href} className="flex flex-col items-center gap-2 group">
      <div className={`p-3 rounded-xl transition-colors ${colorClasses[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className="text-xs font-medium text-slate-600 group-hover:text-slate-900">
        {label}
      </span>
    </Link>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
  subtitle
}: {
  title: string;
  value: number;
  icon: any;
  color: string;
  subtitle: string;
}) {
  const colorClasses: Record<string, { bg: string; text: string; icon: string }> = {
    blue: { bg: "bg-blue-50", text: "text-blue-600", icon: "bg-blue-100" },
    green: { bg: "bg-green-50", text: "text-green-600", icon: "bg-green-100" },
    yellow: { bg: "bg-yellow-50", text: "text-yellow-600", icon: "bg-yellow-100" },
    orange: { bg: "bg-orange-50", text: "text-orange-600", icon: "bg-orange-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-600", icon: "bg-purple-100" },
    teal: { bg: "bg-teal-50", text: "text-teal-600", icon: "bg-teal-100" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", icon: "bg-emerald-100" },
  };

  const colors = colorClasses[color] || colorClasses.blue;

  return (
    <div className="bg-white rounded-xl border p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className={`text-3xl font-bold mt-1 ${colors.text}`}>{value}</p>
          <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
        </div>
        <div className={`p-2 rounded-lg ${colors.icon}`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
      </div>
    </div>
  );
}
