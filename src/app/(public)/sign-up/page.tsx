import type { Metadata } from "next";
import Cs_AuthShell from "@/app/ui/AuthShell";
import Cs_SignUpForm from "@/app/ui/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a FixMate account as a customer or a technician.",
};

const Cs_SignUpPage = () => {
  return (
    <Cs_AuthShell cs_title="Create your account" cs_subtitle="Join FixMate to request repairs or offer your services.">
      <Cs_SignUpForm />
    </Cs_AuthShell>
  );
};

export default Cs_SignUpPage;
