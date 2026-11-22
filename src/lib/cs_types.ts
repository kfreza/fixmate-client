import type { CS_SERVICE_MODES, Cs_Category, Cs_Role } from "@/lib/cs_constants";

export type Cs_ServiceMode = (typeof CS_SERVICE_MODES)[number];
export type Cs_ApprovalStatus = "pending" | "approved" | "rejected";

// Service as returned by the Express API
export interface Cs_Service {
  _id: string;
  title: string;
  category: Cs_Category;
  description: string;
  image: string;
  basePrice: number;
  estimatedDuration: string;
  serviceMode: Cs_ServiceMode;
  serviceArea: string;
  technicianName: string;
  technicianEmail?: string;
  approvalStatus: Cs_ApprovalStatus;
  isAvailable: boolean;
  avgRating?: number;
  reviewCount?: number;
  createdAt: string;
}

export interface Cs_ListResponse<T> {
  success: boolean;
  items: T[];
}

export interface Cs_PagedResponse<T> extends Cs_ListResponse<T> {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

// Public technician info on the details page
export interface Cs_TechnicianSummary {
  name: string;
  image?: string | null;
  area?: string;
  bio?: string;
}

export interface Cs_ServiceDetailsResponse {
  success: boolean;
  service: Cs_Service;
  technician: Cs_TechnicianSummary;
}

// Props Next.js passes to error.tsx
export interface Cs_ErrorPageProps {
  error: unknown;
  retry: () => void;
}

export type Cs_BookingStatus = "requested" | "accepted" | "rejected" | "in-progress" | "completed" | "cancelled";
export type Cs_PaymentStatus = "unpaid" | "paid";

export interface Cs_StatusHistoryItem {
  status: Cs_BookingStatus | "paid";
  changedAt: string;
}

// Booking as returned by the Express API
export interface Cs_Booking {
  _id: string;
  serviceId: string;
  serviceTitle: string;
  serviceImage: string;
  category: Cs_Category;
  basePrice: number;
  technicianName: string;
  technicianEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
  status: Cs_BookingStatus;
  finalAmount: number;
  paymentStatus: Cs_PaymentStatus;
  statusHistory: Cs_StatusHistoryItem[];
  rating?: number;
  review?: string;
  reviewedAt?: string;
  createdAt: string;
}

// Chart series from /stats endpoints
export interface Cs_StatusCount {
  status: Cs_BookingStatus;
  count: number;
}

export interface Cs_MonthAmount {
  month: string;
  label: string;
  amount: number;
}

export interface Cs_CustomerStatsResponse {
  success: boolean;
  stats: {
    totalBookings: number;
    activeBookings: number;
    completedBookings: number;
    cancelledBookings: number;
    totalSpent: number;
    unpaidCount: number;
    unpaidAmount: number;
  };
  charts: { bookingsByStatus: Cs_StatusCount[]; monthlySpending: Cs_MonthAmount[] };
}

export interface Cs_TechnicianStatsResponse {
  success: boolean;
  stats: {
    totalServices: number;
    approvedServices: number;
    pendingServices: number;
    totalJobs: number;
    newRequests: number;
    activeJobs: number;
    completedJobs: number;
    totalEarnings: number;
  };
  charts: { jobsByStatus: Cs_StatusCount[]; monthlyEarnings: Cs_MonthAmount[] };
}

export interface Cs_AdminStatsResponse {
  success: boolean;
  stats: {
    totalUsers: number;
    totalCustomers: number;
    totalTechnicians: number;
    totalServices: number;
    pendingServices: number;
    totalBookings: number;
    activeBookings: number;
    totalRevenue: number;
    totalPayments: number;
  };
  charts: {
    bookingsByStatus: Cs_StatusCount[];
    monthlyRevenue: Cs_MonthAmount[];
    servicesByCategory: { category: Cs_Category; count: number }[];
    usersByRole: { role: Cs_Role; count: number }[];
  };
}

// User as returned by /api/admin/users
export interface Cs_AdminUser {
  _id: string;
  name: string;
  email: string;
  image?: string | null;
  role: Cs_Role;
  phone?: string;
  area?: string;
  createdAt?: string;
}

// Payment as returned by the Express API
export interface Cs_Payment {
  _id: string;
  bookingId: string;
  serviceTitle: string;
  customerName: string;
  customerEmail: string;
  technicianName: string;
  technicianEmail: string;
  amount: number;
  currency: string;
  transactionId: string;
  stripeSessionId: string;
  paymentStatus: "paid";
  paidAt: string;
}

export interface Cs_AdminPaymentsResponse extends Cs_ListResponse<Cs_Payment> {
  totalRevenue: number;
  count: number;
}

// Public review from /api/services/:id/reviews
export interface Cs_ReviewItem {
  _id: string;
  customerName: string;
  rating: number;
  review: string;
  reviewedAt?: string;
}

export interface Cs_ReviewsResponse extends Cs_ListResponse<Cs_ReviewItem> {
  avgRating: number;
  reviewCount: number;
}
