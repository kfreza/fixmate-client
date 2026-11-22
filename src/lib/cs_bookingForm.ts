// Mirrors the server rules in cs_bookingValidator.ts
export const CS_TIMEZONE = "Asia/Dhaka";
export const CS_BOOKING_MAX_DAYS_AHEAD = 90;
export const CS_PROBLEM_MIN = 20;
export const CS_PROBLEM_MAX = 1000;

export interface Cs_BookingFormValues {
  customerPhone: string;
  address: string;
  preferredDate: string;
  problemDescription: string;
}

export type Cs_BookingFormErrors = Partial<Record<keyof Cs_BookingFormValues, string>>;

// YYYY-MM-DD in Dhaka time, same as the server
export const cs_getDhakaDay = (cs_offsetDays = 0) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: CS_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(
    new Date(Date.now() + cs_offsetDays * 86_400_000),
  );

export const cs_validateBookingForm = (cs_values: Cs_BookingFormValues): Cs_BookingFormErrors => {
  const cs_errors: Cs_BookingFormErrors = {};
  const cs_phone = cs_values.customerPhone.replace(/[\s-]/g, "");
  const cs_address = cs_values.address.trim();
  const cs_problem = cs_values.problemDescription.trim();

  if (!/^\+?\d{7,15}$/.test(cs_phone)) cs_errors.customerPhone = "Enter a valid phone number (7 to 15 digits)";
  if (cs_address.length < 5) cs_errors.address = "Address must be at least 5 characters";
  else if (cs_address.length > 300) cs_errors.address = "Address must be at most 300 characters";

  if (!cs_values.preferredDate) cs_errors.preferredDate = "Pick a date";
  else if (cs_values.preferredDate < cs_getDhakaDay()) cs_errors.preferredDate = "Date must be today or later";
  else if (cs_values.preferredDate > cs_getDhakaDay(CS_BOOKING_MAX_DAYS_AHEAD))
    cs_errors.preferredDate = `Date must be within ${CS_BOOKING_MAX_DAYS_AHEAD} days`;

  if (cs_problem.length < CS_PROBLEM_MIN) cs_errors.problemDescription = `Describe the problem in at least ${CS_PROBLEM_MIN} characters`;
  else if (cs_problem.length > CS_PROBLEM_MAX) cs_errors.problemDescription = `Keep it under ${CS_PROBLEM_MAX} characters`;

  return cs_errors;
};
