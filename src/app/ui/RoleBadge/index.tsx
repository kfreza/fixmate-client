const CS_ROLE_STYLES: Record<string, string> = {
  customer: "bg-teal-500/12 text-teal-700 dark:text-teal-300",
  technician: "bg-orange-500/15 text-orange-700 dark:text-orange-300",
  admin: "bg-indigo-500/15 text-indigo-700 dark:text-indigo-300",
};

const Cs_RoleBadge = ({ cs_role }: { cs_role?: string | null }) => {
  const cs_key = cs_role && CS_ROLE_STYLES[cs_role] ? cs_role : "customer";
  return <span className={`cs_role_badge ${CS_ROLE_STYLES[cs_key]}`}>{cs_key}</span>;
};

export default Cs_RoleBadge;
