import { cs_requireRole } from "@/lib/cs_session";

// Customer area only (pages re-check too)
const Cs_CustomerLayout = async ({ children }: LayoutProps<"/dashboard/customer">) => {
  await cs_requireRole("customer");
  return children;
};

export default Cs_CustomerLayout;
