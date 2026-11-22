import { cs_requireRole } from "@/lib/cs_session";

// Admin area only (pages re-check too)
const Cs_AdminLayout = async ({ children }: LayoutProps<"/dashboard/admin">) => {
  await cs_requireRole("admin");
  return children;
};

export default Cs_AdminLayout;
