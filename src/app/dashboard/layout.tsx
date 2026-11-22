import { cookies } from "next/headers";
import { cs_requireSession } from "@/lib/cs_session";
import { CS_SIDEBAR_COOKIE } from "@/lib/cs_dashboardNav";
import Cs_DashboardShell from "@/app/ui/DashboardShell";

// Every dashboard route needs a valid session
const Cs_DashboardLayout = async ({ children }: LayoutProps<"/dashboard">) => {
  const cs_session = await cs_requireSession();
  const cs_isCollapsed =
    (await cookies()).get(CS_SIDEBAR_COOKIE)?.value === "1";
  const {
    name: cs_name,
    email: cs_email,
    image: cs_image,
    role: cs_role,
  } = cs_session.user;

  return (
    <Cs_DashboardShell
      cs_user={{
        name: cs_name,
        email: cs_email,
        image: cs_image,
        role: cs_role,
      }}
      cs_initialCollapsed={cs_isCollapsed}
    >
      {children}
    </Cs_DashboardShell>
  );
};

export default Cs_DashboardLayout;
