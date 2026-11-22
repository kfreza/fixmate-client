import type { Metadata } from "next";
import { cs_requireRole } from "@/lib/cs_session";
import Cs_DashboardHeading from "@/app/ui/DashboardHeading";

export const metadata: Metadata = { title: "Technician Dashboard" };

// Placeholder until the overview commit
const Cs_TechnicianOverviewPage = async () => {
  const cs_session = await cs_requireRole("technician");
  return (
    <Cs_DashboardHeading
      cs_title={`Welcome back, ${cs_session.user.name.split(" ")[0]}`}
      cs_subtitle="Your overview will appear here."
    />
  );
};

export default Cs_TechnicianOverviewPage;
