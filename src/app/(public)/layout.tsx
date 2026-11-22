import Cs_Header from "@/app/ui/Header";
import Cs_Footer from "@/app/ui/Footer";

const Cs_PublicLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <>
      <Cs_Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Cs_Footer />
    </>
  );
};

export default Cs_PublicLayout;
