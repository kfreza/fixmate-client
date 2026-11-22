"use client";

import { toast } from "sonner";
import Cs_ThemeToggle from "@/app/ui/ThemeToggle";

// Temporary theme preview, replaced by the home page in C10
const Cs_HomePage = () => {
  return (
    <div className="cs_blueprint_bg flex flex-1 items-center">
      <div className="cs_container cs_section flex flex-col items-center gap-6 text-center">
        <Cs_ThemeToggle />
        <h1 className="cs_section_title">FixMate</h1>
        <p className="cs_section_subtitle">Smart Device &amp; Home Appliance Repair Service Platform</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button className="cs_btn cs_btn_style_1" onClick={() => toast.success("Repair request sent!")}>
            Request Repair
          </button>
          <button className="cs_btn cs_btn_style_2" onClick={() => toast.error("Something went wrong")}>
            Primary
          </button>
          <button className="cs_btn cs_btn_style_3" onClick={() => toast.info("Waiting for admin approval")}>
            Outline
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cs_HomePage;
