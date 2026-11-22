import { headers } from "next/headers";
import jwt from "jsonwebtoken";
import { auth } from "@/lib/auth";

const CS_TOKEN_TTL_SECONDS = 60 * 60; // 1 hour

// GET /api/token → short-lived JWT for the Express API
export const GET = async () => {
  const cs_session = await auth.api.getSession({ headers: await headers() });
  if (!cs_session) {
    return Response.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  const cs_secret = process.env.CS_JWT_SECRET;
  if (!cs_secret) {
    return Response.json({ success: false, message: "CS_JWT_SECRET is not set" }, { status: 500 });
  }

  const cs_token = jwt.sign({ email: cs_session.user.email }, cs_secret, {
    algorithm: "HS256",
    expiresIn: CS_TOKEN_TTL_SECONDS,
  });

  return Response.json(
    { success: true, token: cs_token, expiresAt: Date.now() + CS_TOKEN_TTL_SECONDS * 1000 },
    { headers: { "Cache-Control": "no-store" } },
  );
};
