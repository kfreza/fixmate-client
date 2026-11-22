import type { CS_SERVICE_MODES, Cs_Category } from "@/lib/cs_constants";

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
