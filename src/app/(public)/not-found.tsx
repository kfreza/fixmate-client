import type { Metadata } from "next";
import Cs_NotFoundView from "@/app/ui/NotFoundView";

export const metadata: Metadata = {
  title: "Page Not Found",
};

// notFound() inside public pages; the layout already has the header
const Cs_PublicNotFound = () => <Cs_NotFoundView />;

export default Cs_PublicNotFound;
