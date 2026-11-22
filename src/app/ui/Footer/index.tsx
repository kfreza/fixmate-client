import Link from "next/link";
import { MailIcon, MapPinIcon, PhoneIcon, ShieldCheckIcon } from "lucide-react";
import { CS_CATEGORIES, cs_getCategoryPath } from "@/lib/cs_constants";
import Cs_Logo from "@/app/ui/Logo";
import { Cs_FacebookIcon, Cs_LinkedinIcon, Cs_XIcon, Cs_YoutubeIcon } from "@/app/ui/SocialIcons";

const cs_data = {
  tagline:
    "Verified technicians for your phone, laptop and home appliances. Track every job step by step and pay only after it's fixed.",
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "Browse Services", href: "/services" },
    { label: "How It Works", href: "/about" },
    { label: "Become a Technician", href: "/sign-up" },
  ],
  contact: [
    { icon: MailIcon, label: "support@fixmate.app", href: "mailto:support@fixmate.app" },
    { icon: PhoneIcon, label: "+880 1700-112233", href: "tel:+8801700112233" },
    { icon: MapPinIcon, label: "House 12, Road 5, Dhanmondi, Dhaka 1205" },
  ],
  socials: [
    { icon: Cs_FacebookIcon, label: "Facebook", href: "https://facebook.com" },
    { icon: Cs_XIcon, label: "X", href: "https://x.com" },
    { icon: Cs_LinkedinIcon, label: "LinkedIn", href: "https://linkedin.com" },
    { icon: Cs_YoutubeIcon, label: "YouTube", href: "https://youtube.com" },
  ],
};

const Cs_Footer = () => {
  const cs_year = new Date().getFullYear();

  return (
    <footer className="cs_site_footer">
      <div className="cs_container grid grid-cols-2 gap-x-6 gap-y-10 py-14 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] lg:py-16">
        {/* Brand */}
        <div className="col-span-2 flex flex-col gap-5 lg:col-span-1">
          <Cs_Logo cs_className="cs_footer_logo" />
          <p className="max-w-xs text-sm leading-relaxed text-slate-400">{cs_data.tagline}</p>
          <div className="flex gap-2.5">
            {cs_data.socials.map(({ icon: Cs_Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="cs_social_link"
              >
                <Cs_Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="cs_footer_title">Quick Links</h3>
          <ul className="cs_footer_list">
            {cs_data.quickLinks.map((cs_link) => (
              <li key={cs_link.href + cs_link.label}>
                <Link href={cs_link.href} className="cs_footer_link">
                  {cs_link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="cs_footer_title">Popular Categories</h3>
          <ul className="cs_footer_list">
            {CS_CATEGORIES.map((cs_category) => (
              <li key={cs_category}>
                <Link href={cs_getCategoryPath(cs_category)} className="cs_footer_link">
                  {cs_category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="col-span-2 lg:col-span-1">
          <h3 className="cs_footer_title">Contact Us</h3>
          <ul className="cs_footer_list">
            {cs_data.contact.map(({ icon: Cs_Icon, label, href }) => (
              <li key={label} className="flex items-start gap-3">
                <span className="cs_footer_contact_icon">
                  <Cs_Icon className="size-4" />
                </span>
                {href ? (
                  <a href={href} className="cs_footer_link pt-1.5">
                    {label}
                  </a>
                ) : (
                  <span className="pt-1.5 text-sm text-slate-400">{label}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="cs_container flex flex-col items-center justify-between gap-3 py-5 text-sm text-slate-400 sm:flex-row">
          <p>&copy; {cs_year} FixMate. All rights reserved.</p>
          <p className="flex items-center gap-2">
            <ShieldCheckIcon className="size-4 text-(--cs_footer_accent)" />
            Pay only after your device is fixed
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Cs_Footer;
