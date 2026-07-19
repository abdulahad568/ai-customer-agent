export interface TicketPayload {
  name: string;
  email: string;
  ticket: string;
}

export interface Customer {
  name: string;
  email: string;
  plan: string;
  accountStatus: string;
  lastPayment: string;
  subscription: string;
}

export interface TicketResult {
  customer: Customer;
  sentiment: "Positive" | "Neutral" | "Negative";
  intent: string;
  priority: "High" | "Medium" | "Low";
  resolution: string;
}

export interface DashboardStats {
  total: number;
  resolved: number;
  pending: number;
  urgent: number;
  byPriority: { name: string; value: number }[];
  bySentiment: { name: string; value: number }[];
}

export interface RecentTicket {
  id: number;
  name: string;
  email: string;
  ticket: string;
  sentiment: string;
  intent: string;
  priority: string;
  resolution: string;
  created_at: string;
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
  return data as T;
}

export const submitTicket = (payload: TicketPayload) =>
  request<TicketResult>("/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const getDashboardStats = () =>
  request<DashboardStats>("/api/dashboard/stats");

export const getRecentTickets = () =>
  request<RecentTicket[]>("/api/dashboard/recent");
