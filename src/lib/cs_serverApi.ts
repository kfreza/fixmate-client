import jwt from "jsonwebtoken";
import { cs_requireSession } from "@/lib/cs_session";

// Authed Express call from a server component (same JWT as /api/token)
export const cs_serverApi = async <T>(cs_path: string): Promise<T> => {
  const cs_session = await cs_requireSession();
  const cs_secret = process.env.CS_JWT_SECRET;
  if (!cs_secret) throw new Error("CS_JWT_SECRET is not set");

  const cs_token = jwt.sign({ email: cs_session.user.email }, cs_secret, { algorithm: "HS256", expiresIn: 60 });
  const cs_response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${cs_path}`, {
    headers: { Authorization: `Bearer ${cs_token}` },
    cache: "no-store",
  });
  // Lets error.tsx show the retry screen
  if (!cs_response.ok) throw new Error(`API ${cs_path} failed with ${cs_response.status}`);
  return (await cs_response.json()) as T;
};
