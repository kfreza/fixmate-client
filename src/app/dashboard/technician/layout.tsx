import { cs_requireRole } from "@/lib/cs_session";

// Technician area only (pages re-check too)
const Cs_TechnicianLayout = async ({ children }: LayoutProps<"/dashboard/technician">) => {
  await cs_requireRole("technician");
  return children;
};

export default Cs_TechnicianLayout;
