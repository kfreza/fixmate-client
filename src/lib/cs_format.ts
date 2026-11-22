// "Rafiq Hasan" → "RH"
export const cs_getInitials = (cs_name: string) =>
  cs_name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((cs_part) => cs_part[0]?.toUpperCase())
    .join("");
