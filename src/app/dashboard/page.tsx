import { redirect } from "next/navigation";
import { cs_requireSession } from "@/lib/cs_session";
import { cs_getDashboardPath } from "@/lib/cs_constants";

// /dashboard → own role dashboard
const Cs_DashboardIndexPage = async () => {
  const cs_session = await cs_requireSession();
  redirect(cs_getDashboardPath(cs_session.user.role));
};

export default Cs_DashboardIndexPage;
