import jwt from "jsonwebtoken";
import { cs_requireSession } from "@/lib/cs_session";

// Authed Express call that also returns the status (for pages that show each case)
export const cs_serverApiResult = async <T>(cs_path: string): Promise<{ status: number; data: T }> => {
  const cs_session = await cs_requireSession();
  const cs_secret = process.env.CS_JWT_SECRET;
  if (!cs_secret) throw new Error("CS_JWT_SECRET is not set");

  const cs_token = jwt.sign({ email: cs_session.user.email }, cs_secret, { algorithm: "HS256", expiresIn: 60 });
  const cs_response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${cs_path}`, {
    headers: { Authorization: `Bearer ${cs_token}` },
    cache: "no-store",
  });
  return { status: cs_response.status, data: (await cs_response.json()) as T };
};

// Authed Express call from a server component (same JWT as /api/token)
export const cs_serverApi = async <T>(cs_path: string): Promise<T> => {
  const { status: cs_status, data: cs_data } = await cs_serverApiResult<T>(cs_path);
  // Lets error.tsx show the retry screen
  if (cs_status < 200 || cs_status >= 300) throw new Error(`API ${cs_path} failed with ${cs_status}`);
  return cs_data;
};
