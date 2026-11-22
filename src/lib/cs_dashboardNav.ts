import {
  CalendarCheckIcon,
  ClipboardListIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  ListChecksIcon,
  PackageIcon,
  PlusCircleIcon,
  ReceiptIcon,
  UserPenIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";
import type { Cs_Role } from "@/lib/cs_constants";

export interface Cs_NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// Sidebar links per role; the first one is the overview
export const CS_DASHBOARD_NAV: Record<Cs_Role, Cs_NavItem[]> = {
  customer: [
    { label: "Overview", href: "/dashboard/customer", icon: LayoutDashboardIcon },
    { label: "My Bookings", href: "/dashboard/customer/bookings", icon: CalendarCheckIcon },
    { label: "Payment History", href: "/dashboard/customer/payments", icon: CreditCardIcon },
  ],
  technician: [
    { label: "Overview", href: "/dashboard/technician", icon: LayoutDashboardIcon },
    { label: "Add Service", href: "/dashboard/technician/add-service", icon: PlusCircleIcon },
    { label: "My Services", href: "/dashboard/technician/my-services", icon: PackageIcon },
    { label: "Job Requests", href: "/dashboard/technician/requests", icon: ClipboardListIcon },
  ],
  admin: [
    { label: "Overview", href: "/dashboard/admin", icon: LayoutDashboardIcon },
    { label: "Users", href: "/dashboard/admin/users", icon: UsersIcon },
    { label: "Services", href: "/dashboard/admin/services", icon: ListChecksIcon },
    { label: "All Bookings", href: "/dashboard/admin/bookings", icon: CalendarCheckIcon },
    { label: "Transactions", href: "/dashboard/admin/transactions", icon: ReceiptIcon },
  ],
};

export const CS_PROFILE_NAV: Cs_NavItem = { label: "Profile", href: "/dashboard/profile", icon: UserPenIcon };

// Overview matches exactly; other links also match their sub-pages
export const cs_isNavActive = (cs_item: Cs_NavItem, cs_pathname: string, cs_items: Cs_NavItem[]) =>
  cs_item.href === cs_items[0]?.href
    ? cs_pathname === cs_item.href
    : cs_pathname === cs_item.href || cs_pathname.startsWith(`${cs_item.href}/`);

export const CS_SIDEBAR_COOKIE = "cs_sidebar_collapsed";
