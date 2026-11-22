import Link from "next/link";
import { InfoIcon, LogInIcon } from "lucide-react";
import { cs_getServerSession } from "@/lib/cs_session";
import Cs_RequestRepairDialog from "@/app/ui/RequestRepairDialog";

type Cs_RequestActionProps = {
  cs_serviceId: string;
  cs_serviceTitle: string;
};

// Picks the request UI by role; the server enforces it again
const Cs_RequestAction = async ({ cs_serviceId, cs_serviceTitle }: Cs_RequestActionProps) => {
  const cs_session = await cs_getServerSession();

  if (!cs_session) {
    const cs_redirect = encodeURIComponent(`/services/${cs_serviceId}`);
    return (
      <Link href={`/sign-in?redirect=${cs_redirect}`} className="cs_btn cs_btn_style_1 w-full py-3.5 text-base">
        <LogInIcon className="size-5" />
        Sign in to Request Repair
      </Link>
    );
  }

  if (cs_session.user.role !== "customer") {
    return (
      <p className="cs_role_notice">
        <InfoIcon className="mt-0.5 size-4 shrink-0" />
        Only customer accounts can request repairs. You are signed in as {cs_session.user.role === "admin" ? "an" : "a"}{" "}
        {cs_session.user.role}.
      </p>
    );
  }

  return (
    <Cs_RequestRepairDialog
      cs_serviceId={cs_serviceId}
      cs_serviceTitle={cs_serviceTitle}
      cs_customer={{ name: cs_session.user.name, email: cs_session.user.email }}
    />
  );
};

export default Cs_RequestAction;
