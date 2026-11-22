export const CS_ROLES = ["customer", "technician", "admin"] as const;
export type Cs_Role = (typeof CS_ROLES)[number];

// Roles a user can pick on sign up
export const CS_SIGNUP_ROLES = ["customer", "technician"] as const;

export const cs_getDashboardPath = (cs_role?: string | null) =>
  `/dashboard/${CS_ROLES.includes(cs_role as Cs_Role) ? cs_role : "customer"}`;

export const CS_PASSWORD_RULES = [
  { cs_test: (cs_value: string) => cs_value.length >= 6, cs_message: "At least 6 characters" },
  { cs_test: (cs_value: string) => /[A-Z]/.test(cs_value), cs_message: "At least one uppercase letter" },
  { cs_test: (cs_value: string) => /[a-z]/.test(cs_value), cs_message: "At least one lowercase letter" },
];

export const cs_getPasswordErrors = (cs_password: string) =>
  CS_PASSWORD_RULES.filter((cs_rule) => !cs_rule.cs_test(cs_password)).map((cs_rule) => cs_rule.cs_message);
