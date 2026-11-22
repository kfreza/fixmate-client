// "Rafiq Hasan" → "RH"
export const cs_getInitials = (cs_name: string) =>
  cs_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((cs_part) => cs_part[0]?.toUpperCase())
    .join("");

const CS_MONEY = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

export const cs_formatMoney = (cs_amount: number) => CS_MONEY.format(cs_amount);

// Calendar day saved as UTC midnight, so read it in UTC
export const cs_formatDay = (cs_iso: string) =>
  new Date(cs_iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });

// A real moment, shown in Dhaka time
export const cs_formatDateTime = (cs_iso: string) =>
  new Date(cs_iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  });
