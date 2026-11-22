import Cs_Header from "@/app/ui/Header";

const Cs_PublicLayout = ({ children }: LayoutProps<"/">) => {
  return (
    <>
      <Cs_Header />
      <main className="flex flex-1 flex-col">{children}</main>
    </>
  );
};

export default Cs_PublicLayout;
