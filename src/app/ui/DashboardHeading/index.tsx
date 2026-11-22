type Cs_DashboardHeadingProps = {
  cs_title: string;
  cs_subtitle?: string;
  children?: React.ReactNode;
};

// Page heading with an optional action on the right
const Cs_DashboardHeading = ({ cs_title, cs_subtitle, children }: Cs_DashboardHeadingProps) => {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between md:mb-8">
      <div>
        <h2 className="font-heading text-2xl font-bold tracking-tight text-(--cs_heading_color) md:text-3xl">{cs_title}</h2>
        {cs_subtitle && <p className="mt-1.5 text-sm text-(--cs_body_color) md:text-base">{cs_subtitle}</p>}
      </div>
      {children}
    </div>
  );
};

export default Cs_DashboardHeading;
