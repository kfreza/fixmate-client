"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CreditCardIcon, LoaderCircleIcon } from "lucide-react";
import { cs_api, cs_getErrorMessage } from "@/lib/cs_api";
import { cs_formatMoney } from "@/lib/cs_format";

type Cs_PayNowButtonProps = {
  cs_bookingId: string;
  cs_amount: number;
};

// Sends only the id; the server reads the amount from the booking
const Cs_PayNowButton = ({ cs_bookingId, cs_amount }: Cs_PayNowButtonProps) => {
  const [cs_isLoading, cs_setIsLoading] = useState(false);

  const cs_handlePay = async () => {
    cs_setIsLoading(true);
    try {
      const { data: cs_data } = await cs_api.post<{ url: string }>("/api/payments/create-checkout-session", {
        bookingId: cs_bookingId,
      });
      window.location.assign(cs_data.url);
    } catch (cs_error) {
      toast.error(cs_getErrorMessage(cs_error, "Could not start the payment"));
      cs_setIsLoading(false);
    }
  };

  return (
    <button type="button" onClick={cs_handlePay} disabled={cs_isLoading} className="cs_btn cs_btn_style_1 px-3.5 py-2 text-xs whitespace-nowrap">
      {cs_isLoading ? <LoaderCircleIcon className="size-4 animate-spin" /> : <CreditCardIcon className="size-4" />}
      Pay {cs_formatMoney(cs_amount)}
    </button>
  );
};

export default Cs_PayNowButton;
