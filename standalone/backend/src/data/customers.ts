export interface Customer {
  name: string;
  email: string;
  plan: string;
  accountStatus: string;
  lastPayment: string;
  subscription: string;
}

export const customers: Customer[] = [
  { name: "Alice Johnson",   email: "alice.johnson@example.com",   plan: "Pro",        accountStatus: "Active",    lastPayment: "2025-07-01", subscription: "Monthly" },
  { name: "Bob Martinez",    email: "bob.martinez@example.com",    plan: "Basic",      accountStatus: "Active",    lastPayment: "2025-06-28", subscription: "Monthly" },
  { name: "Carol Williams",  email: "carol.williams@example.com",  plan: "Enterprise", accountStatus: "Active",    lastPayment: "2025-07-10", subscription: "Annual"  },
  { name: "David Chen",      email: "david.chen@example.com",      plan: "Pro",        accountStatus: "Suspended", lastPayment: "2025-05-15", subscription: "Monthly" },
  { name: "Emily Rodriguez", email: "emily.rodriguez@example.com", plan: "Basic",      accountStatus: "Active",    lastPayment: "2025-07-05", subscription: "Annual"  },
  { name: "Frank Thompson",  email: "frank.thompson@example.com",  plan: "Enterprise", accountStatus: "Active",    lastPayment: "2025-07-08", subscription: "Annual"  },
  { name: "Grace Kim",       email: "grace.kim@example.com",       plan: "Pro",        accountStatus: "Active",    lastPayment: "2025-06-30", subscription: "Monthly" },
  { name: "Henry Parker",    email: "henry.parker@example.com",    plan: "Basic",      accountStatus: "Inactive",  lastPayment: "2025-04-20", subscription: "Monthly" },
  { name: "Isabella Nguyen", email: "isabella.nguyen@example.com", plan: "Enterprise", accountStatus: "Active",    lastPayment: "2025-07-12", subscription: "Annual"  },
  { name: "James Wilson",    email: "james.wilson@example.com",    plan: "Pro",        accountStatus: "Active",    lastPayment: "2025-07-03", subscription: "Monthly" },
  { name: "Karen Davis",     email: "karen.davis@example.com",     plan: "Basic",      accountStatus: "Active",    lastPayment: "2025-06-25", subscription: "Annual"  },
  { name: "Liam Brown",      email: "liam.brown@example.com",      plan: "Enterprise", accountStatus: "Suspended", lastPayment: "2025-06-01", subscription: "Annual"  },
];
