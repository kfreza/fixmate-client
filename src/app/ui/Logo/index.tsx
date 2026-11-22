import Link from "next/link";
import { WrenchIcon } from "lucide-react";

// Same logo on every page
const Cs_Logo = ({ cs_className = "" }: { cs_className?: string }) => {
  return (
    <Link href="/" aria-label="FixMate home" className={`cs_logo ${cs_className}`}>
      <span className="cs_logo_icon">
        <WrenchIcon className="size-5" strokeWidth={2.4} />
      </span>
      <span className="cs_logo_text">
        Fix<span className="cs_logo_accent">Mate</span>
      </span>
    </Link>
  );
};

export default Cs_Logo;
