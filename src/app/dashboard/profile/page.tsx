import type { Metadata } from "next";
import { LockIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cs_requireSession } from "@/lib/cs_session";
import Cs_DashboardHeading from "@/app/ui/DashboardHeading";
import Cs_RoleBadge from "@/app/ui/RoleBadge";
import Cs_ProfileForm from "@/app/ui/ProfileForm";

export const metadata: Metadata = { title: "My Profile" };

// Every role can edit their own profile; email and role stay locked
const Cs_ProfilePage = async () => {
  const { user: cs_user } = await cs_requireSession();

  return (
    <>
      <Cs_DashboardHeading cs_title="My Profile" cs_subtitle="Update your photo and contact details." />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="cs_chart_card">
          <Cs_ProfileForm
            cs_initial={{ name: cs_user.name, phone: cs_user.phone ?? "", area: cs_user.area ?? "", bio: cs_user.bio ?? "" }}
            cs_image={cs_user.image ?? null}
            cs_showBio={cs_user.role === "technician"}
          />
        </section>

        <aside className="cs_chart_card flex h-fit flex-col gap-5">
          <h3 className="flex items-center gap-2 font-semibold text-(--cs_heading_color)">
            <LockIcon className="size-4 text-(--cs_primary_color)" />
            Account
          </h3>
          <div className="flex flex-col gap-2">
            <Label htmlFor="cs_account_email" className="cs_form_label">
              Email
            </Label>
            <Input id="cs_account_email" value={cs_user.email} readOnly className="cs_input cs_input_readonly" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="cs_form_label">Role</span>
            <Cs_RoleBadge cs_role={cs_user.role} />
          </div>
          <p className="text-xs leading-relaxed text-(--cs_body_color)">
            Your email is your login and cannot be changed. Only an admin can change your role.
          </p>
        </aside>
      </div>
    </>
  );
};

export default Cs_ProfilePage;
