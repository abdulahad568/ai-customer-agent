import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Send, Loader2 } from "lucide-react";
import { submitTicket } from "../lib/api";

export default function Submit() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", ticket: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function set(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.ticket) {
      setError("All fields are required.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const result = await submitTicket(form);
      sessionStorage.setItem("lastResult", JSON.stringify(result));
      navigate("/result");
    } catch (err: any) {
      setError(err.message ?? "Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full bg-background border border-border rounded-md px-3 py-2 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 transition-colors";

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          New Incident
          <span className="inline-flex h-2 w-2 rounded-full bg-primary animate-pulse" />
        </h1>
        <p className="text-slate-400 text-sm">
          Enter customer inquiry details. AI agent will analyze intent, sentiment, and generate a resolution automatically.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-border bg-muted">
          <p className="font-mono text-xs tracking-wider text-primary">DATA_ENTRY_NODE</p>
          <p className="text-sm text-slate-400 mt-0.5">All fields are required for analysis</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                Customer Name
              </label>
              <input
                type="text"
                placeholder="Jane Doe"
                value={form.name}
                onChange={set("name")}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="jane@example.com"
                value={form.email}
                onChange={set("email")}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <label className="text-xs uppercase tracking-wider text-slate-400">
                Inquiry Content
              </label>
              <span className="text-[10px] text-primary font-mono">RAW_TEXT</span>
            </div>
            <textarea
              placeholder="Paste the customer's message here..."
              rows={8}
              value={form.ticket}
              onChange={set("ticket")}
              className={`${inputClass} resize-y`}
            />
          </div>

          {error && (
            <div className="bg-red-950/50 border border-red-800/50 rounded-md px-4 py-3 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-background font-mono text-sm font-bold tracking-wider rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  ANALYZING...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  INITIALIZE ANALYSIS
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
