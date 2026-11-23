import { cache } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { cs_connectMongo } from "@/lib/cs_mongodb";
import { cs_getDashboardPath, cs_getSafeRedirect, type Cs_Role } from "@/lib/cs_constants";

// Real session check (DB), once per request
export const cs_getServerSession = cache(async () => {
  await cs_connectMongo();
  return auth.api.getSession({ headers: await headers() });
});

// Any logged-in user, else sign-in with redirect back
export const cs_requireSession = async () => {
  const cs_session = await cs_getServerSession();
  if (!cs_session) {
    const cs_path = cs_getSafeRedirect((await headers()).get("x-cs-pathname"));
    redirect(cs_path ? `/sign-in?redirect=${encodeURIComponent(cs_path)}` : "/sign-in");
  }
  return cs_session;
};

// Wrong role goes to its own dashboard
export const cs_requireRole = async (cs_role: Cs_Role) => {
  const cs_session = await cs_requireSession();
  if (cs_session.user.role !== cs_role) redirect(cs_getDashboardPath(cs_session.user.role));
  return cs_session;
};

// For sign-in/sign-up pages
export const cs_redirectIfSignedIn = async (cs_target?: string | null) => {
  const cs_session = await cs_getServerSession();
  if (cs_session) redirect(cs_target ?? cs_getDashboardPath(cs_session.user.role));
};
