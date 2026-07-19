import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, AlertTriangle, MessageSquare, CheckCircle } from "lucide-react";
import type { TicketResult } from "../lib/api";

const sentimentStyle: Record<string, string> = {
  Positive: "text-green-400 bg-green-950/50 border-green-800/50",
  Neutral:  "text-yellow-400 bg-yellow-950/50 border-yellow-800/50",
  Negative: "text-red-400 bg-red-950/50 border-red-800/50",
};

const priorityStyle: Record<string, string> = {
  High:   "text-red-400 bg-red-950/50 border-red-800/50",
  Medium: "text-yellow-400 bg-yellow-950/50 border-yellow-800/50",
  Low:    "text-green-400 bg-green-950/50 border-green-800/50",
};

function Badge({ value, style }: { value: string; style: string }) {
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${style}`}>
      {value}
    </span>
  );
}

export default function Result() {
  const navigate = useNavigate();
  const [data, setData] = useState<TicketResult | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("lastResult");
    if (stored) setData(JSON.parse(stored));
    else navigate("/");
  }, [navigate]);

  if (!data) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate("/")}
        className="flex items-center gap-2 text-slate-400 hover:text-primary text-sm mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        New Ticket
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          Analysis Complete
          <CheckCircle className="h-6 w-6 text-green-400" />
        </h1>
        <p className="text-slate-400 text-sm">AI-generated resolution ready for dispatch.</p>
      </div>

      {/* Badges */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Sentiment", value: data.sentiment, style: sentimentStyle[data.sentiment] },
          { label: "Priority",  value: data.priority,  style: priorityStyle[data.priority]   },
          { label: "Intent",    value: data.intent,    style: "text-primary bg-primary/10 border-primary/20" },
        ].map(({ label, value, style }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-4">
            <p className="text-xs uppercase tracking-wider text-slate-400 mb-2 font-mono">{label}</p>
            <Badge value={value} style={style} />
          </div>
        ))}
      </div>

      {/* Customer + Metrics */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <User className="h-4 w-4 text-primary" />
            <p className="text-xs font-mono tracking-wider text-primary">CUSTOMER_PROFILE</p>
          </div>
          <div className="space-y-2 text-sm">
            {(
              [
                ["Name",          data.customer.name],
                ["Email",         data.customer.email],
                ["Plan",          data.customer.plan],
                ["Status",        data.customer.accountStatus],
                ["Last Payment",  data.customer.lastPayment],
                ["Subscription",  data.customer.subscription],
              ] as [string, string][]
            ).map(([key, val]) => (
              <div key={key} className="flex justify-between gap-2">
                <span className="text-slate-400 shrink-0">{key}</span>
                <span className="text-slate-200 font-mono text-xs text-right truncate">{val}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
            <AlertTriangle className="h-4 w-4 text-primary" />
            <p className="text-xs font-mono tracking-wider text-primary">TICKET_METRICS</p>
          </div>
          <div className="space-y-4 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Priority Level</span>
              <Badge value={data.priority} style={priorityStyle[data.priority]} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Sentiment</span>
              <Badge value={data.sentiment} style={sentimentStyle[data.sentiment]} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-400">Intent</span>
              <span className="text-xs text-primary font-mono text-right">{data.intent}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resolution */}
      <div className="bg-card border border-border rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-border">
          <MessageSquare className="h-4 w-4 text-primary" />
          <p className="text-xs font-mono tracking-wider text-primary">AI_RESOLUTION</p>
        </div>
        <p className="text-slate-200 leading-relaxed text-sm whitespace-pre-wrap">{data.resolution}</p>
      </div>
    </div>
  );
}
