import type { Metadata } from "next";
import Cs_Header from "@/app/ui/Header";
import Cs_Footer from "@/app/ui/Footer";
import Cs_NotFoundView from "@/app/ui/NotFoundView";

export const metadata: Metadata = {
  title: "Page Not Found",
};

// Unknown URLs; renders outside the public layout, so it adds its own header
const Cs_NotFoundPage = () => {
  return (
    <>
      <Cs_Header />
      <main className="flex flex-1 flex-col">
        <Cs_NotFoundView />
      </main>
      <Cs_Footer />
    </>
  );
};

export default Cs_NotFoundPage;
