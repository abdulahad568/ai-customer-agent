import { useEffect, useState } from "react";
import {
  BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { TicketCheck, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { getDashboardStats, getRecentTickets } from "../lib/api";
import type { DashboardStats, RecentTicket } from "../lib/api";

const PRIORITY_COLORS:  Record<string, string> = { High: "#ef4444", Medium: "#f59e0b", Low: "#22c55e" };
const SENTIMENT_COLORS: Record<string, string> = { Positive: "#22c55e", Neutral: "#f59e0b", Negative: "#ef4444" };
const PRIORITY_BADGE:   Record<string, string> = {
  High:   "text-red-400 bg-red-950/50 border-red-800/50",
  Medium: "text-yellow-400 bg-yellow-950/50 border-yellow-800/50",
  Low:    "text-green-400 bg-green-950/50 border-green-800/50",
};

const tooltipStyle = {
  contentStyle: { background: "#0d1929", border: "1px solid #1a2f4a", borderRadius: 8, fontSize: 12 },
};

export default function Dashboard() {
  const [stats,   setStats]   = useState<DashboardStats | null>(null);
  const [recent,  setRecent]  = useState<RecentTicket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getDashboardStats(), getRecentTickets()])
      .then(([s, r]) => { setStats(s); setRecent(r); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const statCards = [
    { label: "Total Tickets", value: stats?.total    ?? 0, icon: TicketCheck,  color: "text-blue-400"   },
    { label: "Resolved",      value: stats?.resolved ?? 0, icon: TrendingUp,   color: "text-green-400"  },
    { label: "Pending",       value: stats?.pending  ?? 0, icon: Clock,        color: "text-yellow-400" },
    { label: "Urgent",        value: stats?.urgent   ?? 0, icon: AlertTriangle,color: "text-red-400"    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Dashboard</h1>
        <p className="text-slate-400 text-sm">Real-time overview of customer support activity.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-mono">{label}</p>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <p className="text-3xl font-bold text-slate-100">{value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      {stats && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs font-mono tracking-wider text-primary mb-4">PRIORITY_DISTRIBUTION</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stats.byPriority}>
                <XAxis dataKey="name" tick={{ fill: "#4a6a8a", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4a6a8a", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {stats.byPriority.map((e) => (
                    <Cell key={e.name} fill={PRIORITY_COLORS[e.name] ?? "#00d4ff"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <p className="text-xs font-mono tracking-wider text-primary mb-4">SENTIMENT_BREAKDOWN</p>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.bySentiment}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={75}
                  label={({ name, percent }) =>
                    percent > 0 ? `${name} ${(percent * 100).toFixed(0)}%` : ""
                  }
                  labelLine={false}
                >
                  {stats.bySentiment.map((e) => (
                    <Cell key={e.name} fill={SENTIMENT_COLORS[e.name] ?? "#00d4ff"} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent tickets */}
      <div className="bg-card border border-border rounded-xl p-5">
        <p className="text-xs font-mono tracking-wider text-primary mb-4">RECENT_TICKETS</p>
        {recent.length === 0 ? (
          <p className="text-slate-400 text-sm text-center py-8">
            No tickets yet. Submit your first ticket to see it here.
          </p>
        ) : (
          <div className="space-y-3">
            {recent.map((t) => (
              <div key={t.id} className="flex items-center gap-4 p-3 rounded-lg border border-border bg-muted">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">{t.name}</p>
                  <p className="text-xs text-slate-400 truncate">{t.ticket}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs px-2 py-0.5 rounded-full border font-semibold ${PRIORITY_BADGE[t.priority] ?? ""}`}>
                    {t.priority}
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    {new Date(t.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
