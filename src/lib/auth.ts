import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { nextCookies } from "better-auth/next-js";
import { cs_db, cs_mongoClient } from "@/lib/cs_mongodb";
import { cs_getPasswordErrors } from "@/lib/cs_constants";

const cs_googleId = process.env.CS_GOOGLE_CLIENT_ID;
const cs_googleSecret = process.env.CS_GOOGLE_CLIENT_SECRET;

export const auth = betterAuth({
  database: mongodbAdapter(cs_db, { client: cs_mongoClient }),

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
  },

  // Google login only when keys are set
  socialProviders:
    cs_googleId && cs_googleSecret
      ? { google: { clientId: cs_googleId, clientSecret: cs_googleSecret } }
      : {},

  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "customer", input: true },
      phone: { type: "string", required: false, input: false },
      area: { type: "string", required: false, input: false },
      bio: { type: "string", required: false, input: false },
    },
  },

  databaseHooks: {
    user: {
      create: {
        // Only customer/technician can sign up; anything else → customer
        before: async (cs_user) => ({
          data: { ...cs_user, role: cs_user.role === "technician" ? "technician" : "customer" },
        }),
      },
    },
  },

  hooks: {
    before: createAuthMiddleware(async (cs_ctx) => {
      // Role changes only through the admin API
      if (cs_ctx.path === "/update-user" && cs_ctx.body?.role !== undefined) {
        throw new APIError("FORBIDDEN", { message: "Role cannot be changed here" });
      }

      // Server-side password rules on sign up
      if (cs_ctx.path === "/sign-up/email") {
        const cs_errors = cs_getPasswordErrors(String(cs_ctx.body?.password ?? ""));
        if (cs_errors.length) {
          throw new APIError("BAD_REQUEST", { message: `Password needs: ${cs_errors.join(", ").toLowerCase()}` });
        }
      }
    }),
  },

  plugins: [nextCookies()], // keep last
});

export type Cs_Session = typeof auth.$Infer.Session;
