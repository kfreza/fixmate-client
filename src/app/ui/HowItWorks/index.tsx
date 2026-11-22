import { CreditCardIcon, SearchIcon, SendIcon, WrenchIcon } from "lucide-react";

const cs_data = {
  eyebrow: "How FixMate works",
  title: "From broken to fixed in four simple steps",
  subtitle: "No calls, no guesswork. Every job is tracked from the first request to the final payment.",
  steps: [
    {
      icon: SearchIcon,
      title: "Find a Service",
      text: "Search by device or problem and compare approved technicians, prices and service areas.",
    },
    {
      icon: SendIcon,
      title: "Send a Request",
      text: "Pick a date, add your address and describe the problem. The technician gets it instantly.",
    },
    {
      icon: WrenchIcon,
      title: "Technician Fixes It",
      text: "Follow the job live as it moves from accepted to in progress to completed.",
    },
    {
      icon: CreditCardIcon,
      title: "Pay After Completion",
      text: "Pay securely with Stripe only after the work is done, at the final agreed amount.",
    },
  ],
};

const Cs_HowItWorks = () => {
  return (
    <section className="cs_section bg-(--cs_card_color)">
      <div className="cs_container">
        <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <span className="cs_eyebrow">{cs_data.eyebrow}</span>
          <h2 className="cs_section_title mt-4">{cs_data.title}</h2>
          <p className="cs_section_subtitle">{cs_data.subtitle}</p>
        </div>

        <ol className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {cs_data.steps.map(({ icon: Cs_Icon, title, text }, cs_index) => (
            <li key={title} className="cs_step_card">
              <div className="flex items-center justify-between">
                <span className="cs_step_icon">
                  <Cs_Icon className="size-6" />
                </span>
                <span className="cs_step_number">0{cs_index + 1}</span>
              </div>
              <h3 className="mt-6 text-lg font-semibold text-(--cs_heading_color)">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-(--cs_body_color)">{text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default Cs_HowItWorks;
