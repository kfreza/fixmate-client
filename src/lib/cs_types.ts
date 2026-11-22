import type { Cs_Category } from "@/lib/cs_constants";

export type Cs_ServiceMode = "Home Visit" | "Shop Drop-off";
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
