import type { Metadata } from "next";
import { cs_getSafeRedirect } from "@/lib/cs_constants";
import { cs_redirectIfSignedIn } from "@/lib/cs_session";
import Cs_AuthShell from "@/app/ui/AuthShell";
import Cs_SignInForm from "@/app/ui/SignInForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your FixMate account.",
};

const Cs_SignInPage = async ({ searchParams }: PageProps<"/sign-in">) => {
  const { redirect: cs_redirectParam } = await searchParams;
  const cs_redirect = cs_getSafeRedirect(typeof cs_redirectParam === "string" ? cs_redirectParam : null);
  await cs_redirectIfSignedIn(cs_redirect);
  // Show Google only when it is configured
  const cs_hasGoogle = !!(process.env.CS_GOOGLE_CLIENT_ID && process.env.CS_GOOGLE_CLIENT_SECRET);

  return (
    <Cs_AuthShell cs_title="Welcome back" cs_subtitle="Sign in to request repairs and track your jobs.">
      <Cs_SignInForm cs_redirect={cs_redirect} cs_hasGoogle={cs_hasGoogle} />
    </Cs_AuthShell>
  );
};

export default Cs_SignInPage;
