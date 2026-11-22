import Link from "next/link";
import { ArrowLeftIcon, SearchIcon } from "lucide-react";
import Cs_ToolsIllustration from "@/app/ui/ToolsIllustration";

// Shared 404 body for the root and the public group
const Cs_NotFoundView = () => {
  return (
    <div className="cs_blueprint_bg flex flex-1 items-center">
      <div className="cs_container flex flex-col items-center py-16 text-center md:py-24">
        <Cs_ToolsIllustration />
        <p className="mt-8 font-heading text-6xl font-bold tracking-tight text-(--cs_primary_color) md:text-7xl">404</p>
        <h1 className="mt-3 font-heading text-2xl font-bold text-(--cs_heading_color) md:text-3xl">
          This page needs a repair
        </h1>
        <p className="mt-3 max-w-md leading-relaxed text-(--cs_body_color)">
          The page you are looking for does not exist, was moved, or the service is no longer available.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="cs_btn cs_btn_style_2">
            <ArrowLeftIcon className="size-4" />
            Back to Home
          </Link>
          <Link href="/services" className="cs_btn cs_btn_style_3">
            <SearchIcon className="size-4" />
            Browse Services
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cs_NotFoundView;
