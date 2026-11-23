import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";
import { cs_connectMongo } from "@/lib/cs_mongodb";

const cs_handlers = toNextJsHandler(auth);

// Reopen the Mongo client first if a cold start left it closed
export const GET = async (cs_request: Request) => {
  await cs_connectMongo();
  return cs_handlers.GET(cs_request);
};

export const POST = async (cs_request: Request) => {
  await cs_connectMongo();
  return cs_handlers.POST(cs_request);
};
