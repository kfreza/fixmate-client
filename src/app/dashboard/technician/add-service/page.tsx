import type { Metadata } from "next";
import { BadgeCheckIcon, ClockIcon, ShieldCheckIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cs_requireRole } from "@/lib/cs_session";
import Cs_DashboardHeading from "@/app/ui/DashboardHeading";
import Cs_ServiceForm from "@/app/ui/ServiceForm";

export const metadata: Metadata = { title: "Add Service" };

const cs_tips = [
  { icon: BadgeCheckIcon, text: "Use a clear, real photo of the device or your work." },
  { icon: ClockIcon, text: "Give an honest starting price and time; you set the final amount when the job is done." },
  { icon: ShieldCheckIcon, text: "An admin reviews every new or edited service before customers can book it." },
];

const Cs_AddServicePage = async () => {
  const cs_session = await cs_requireRole("technician");

  return (
    <>
      <Cs_DashboardHeading cs_title="Add a Service" cs_subtitle="List a repair service. It goes live after admin approval." />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="cs_chart_card">
          {/* Comes from the session; the server also takes it from the token */}
          <div className="mb-6 grid gap-5 border-b border-(--cs_border_color) pb-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="cs_tech_name" className="cs_form_label">
                Technician name
              </Label>
              <Input id="cs_tech_name" value={cs_session.user.name} readOnly className="cs_input cs_input_readonly" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="cs_tech_email" className="cs_form_label">
                Technician email
              </Label>
              <Input id="cs_tech_email" value={cs_session.user.email} readOnly className="cs_input cs_input_readonly" />
            </div>
          </div>
          <Cs_ServiceForm cs_mode="create" />
        </section>

        <aside className="cs_chart_card h-fit">
          <h3 className="font-semibold text-(--cs_heading_color)">Tips for a good listing</h3>
          <ul className="mt-4 flex flex-col gap-4">
            {cs_tips.map(({ icon: Cs_Icon, text }) => (
              <li key={text} className="flex gap-3 text-sm leading-relaxed text-(--cs_body_color)">
                <Cs_Icon className="mt-0.5 size-4 shrink-0 text-(--cs_primary_color)" />
                {text}
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </>
  );
};

export default Cs_AddServicePage;
