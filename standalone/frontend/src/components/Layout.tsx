import { NavLink } from "react-router-dom";
import { LayoutDashboard, TicketCheck, Cpu } from "lucide-react";

const navItems = [
  { to: "/", label: "Submit Ticket", icon: TicketCheck },
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background text-slate-200">
      {/* Sidebar */}
      <aside className="w-60 border-r border-border bg-card flex flex-col shrink-0">
        <div className="h-14 flex items-center gap-2 px-4 border-b border-border">
          <Cpu className="h-5 w-5 text-primary" />
          <span className="font-bold tracking-widest text-sm text-white">NEXUSOPS</span>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-fg px-2 mb-2">
            Navigation
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-slate-400 hover:bg-muted hover:text-slate-200"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-muted-fg">System Status</span>
          </div>
          <p className="text-xs text-slate-500 mt-1 pl-4">All systems operational</p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
