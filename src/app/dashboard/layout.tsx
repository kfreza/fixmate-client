import { cs_requireSession } from "@/lib/cs_session";

// Every dashboard route needs a valid session
const Cs_DashboardLayout = async ({ children }: LayoutProps<"/dashboard">) => {
  await cs_requireSession();
  return <div className="flex min-h-screen flex-col">{children}</div>;
};

export default Cs_DashboardLayout;
