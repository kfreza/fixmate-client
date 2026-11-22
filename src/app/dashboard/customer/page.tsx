import type { Metadata } from "next";
import { cs_requireRole } from "@/lib/cs_session";

export const metadata: Metadata = { title: "Customer Dashboard" };

// Placeholder until the dashboard UI commits
const Cs_CustomerOverviewPage = async () => {
  const cs_session = await cs_requireRole("customer");
  return (
    <section className="cs_container py-16">
      <h1 className="cs_section_title">Customer Dashboard</h1>
      <p className="cs_section_subtitle">Signed in as {cs_session.user.email}</p>
    </section>
  );
};

export default Cs_CustomerOverviewPage;
