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

const API_BASE_URL = "https://nexusops-backened.onrender.com";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  
  // 1. If it's not a successful response, handle it safely without crashing on JSON parsing
  if (!res.ok) {
    let errorMsg = `Request failed (${res.status})`;
    try {
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const errorData = await res.json();
        errorMsg = errorData.error ?? errorMsg;
      } else {
        const textError = await res.text();
        console.error("Non-JSON Error response:", textError);
      }
    } catch (e) {
      // Fallback if parsing fails entirely
    }
    throw new Error(errorMsg);
  }

  // 2. Read the body safely
  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    throw new Error("Server did not return JSON data.");
  }

  return (await res.json()) as T;
}

export const submitTicket = (payload: TicketPayload) =>
  request<TicketResult>("https://nexusops-backened.onrender.com/api/tickets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

export const getDashboardStats = () =>
  request<DashboardStats>("https://nexusops-backened.onrender.com/api/dashboard/stats");

export const getRecentTickets = () =>
  request<RecentTicket[]>("https://nexusops-backened.onrender.com/api/dashboard/recent");