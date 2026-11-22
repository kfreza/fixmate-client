import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ExternalLinkIcon, PackageOpenIcon, PlusIcon } from "lucide-react";
import { cs_requireRole } from "@/lib/cs_session";
import { cs_serverApi } from "@/lib/cs_serverApi";
import { cs_formatMoney } from "@/lib/cs_format";
import type { Cs_ListResponse, Cs_Service } from "@/lib/cs_types";
import Cs_DashboardHeading from "@/app/ui/DashboardHeading";
import Cs_StatusBadge from "@/app/ui/StatusBadge";
import Cs_AvailabilitySwitch from "@/app/ui/AvailabilitySwitch";
import Cs_EditServiceDialog from "@/app/ui/EditServiceDialog";
import Cs_DeleteServiceButton from "@/app/ui/DeleteServiceButton";

export const metadata: Metadata = { title: "My Services" };

const cs_approvalHint: Record<Cs_Service["approvalStatus"], string> = {
  pending: "Waiting for admin review",
  approved: "Live for customers",
  rejected: "Edit and save to request review again",
};

const Cs_Actions = ({ cs_data }: { cs_data: Cs_Service }) => (
  <div className="flex items-center gap-1.5 whitespace-nowrap">
    {/* Only approved and available services have a public page */}
    {cs_data.approvalStatus === "approved" && cs_data.isAvailable && (
      <Link href={`/services/${cs_data._id}`} target="_blank" className="cs_table_action" aria-label={`View ${cs_data.title}`}>
        <ExternalLinkIcon className="size-4" />
      </Link>
    )}
    <Cs_EditServiceDialog cs_data={cs_data} />
    <Cs_DeleteServiceButton cs_serviceId={cs_data._id} cs_serviceTitle={cs_data.title} />
  </div>
);

const Cs_MyServicesPage = async () => {
  await cs_requireRole("technician");
  const { items: cs_services } = await cs_serverApi<Cs_ListResponse<Cs_Service>>("/api/technician/services");
  const cs_count = (cs_status: Cs_Service["approvalStatus"]) =>
    cs_services.filter((cs_service) => cs_service.approvalStatus === cs_status).length;

  return (
    <>
      <Cs_DashboardHeading cs_title="My Services" cs_subtitle="Edit your listings, hide them for a while, or remove them.">
        <Link href="/dashboard/technician/add-service" className="cs_btn cs_btn_style_2 shrink-0">
          <PlusIcon className="size-4" />
          Add Service
        </Link>
      </Cs_DashboardHeading>

      {!cs_services.length ? (
        <div className="cs_empty_state">
          <PackageOpenIcon className="size-8 text-(--cs_primary_color)" />
          <p className="font-semibold text-(--cs_heading_color)">No services yet</p>
          <p className="text-sm text-(--cs_body_color)">Add your first repair service so customers can find you.</p>
          <Link href="/dashboard/technician/add-service" className="cs_btn cs_btn_style_2 mt-3">
            <PlusIcon className="size-4" />
            Add Service
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-5 flex flex-wrap gap-2 text-sm">
            <span className="cs_chip">{cs_services.length} total</span>
            <span className="cs_chip">{cs_count("approved")} approved</span>
            <span className="cs_chip">{cs_count("pending")} pending</span>
            {cs_count("rejected") > 0 && <span className="cs_chip">{cs_count("rejected")} rejected</span>}
          </div>

          {/* Desktop table */}
          <div className="cs_table_wrap hidden xl:block">
            <table className="cs_table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Price</th>
                  <th>Mode &amp; area</th>
                  <th>Approval</th>
                  <th>Availability</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cs_services.map((cs_service) => (
                  <tr key={cs_service._id}>
                    <td>
                      <div className="flex min-w-56 items-center gap-3">
                        <Image src={cs_service.image} alt="" width={48} height={48} className="size-12 shrink-0 rounded-lg object-cover" />
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-medium text-(--cs_heading_color)">{cs_service.title}</p>
                          <p className="text-xs text-(--cs_body_color)">{cs_service.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-semibold whitespace-nowrap text-(--cs_heading_color)">{cs_formatMoney(cs_service.basePrice)}</td>
                    <td>
                      <p className="whitespace-nowrap text-(--cs_heading_color)">{cs_service.serviceMode}</p>
                      <p className="text-xs">{cs_service.serviceArea}</p>
                    </td>
                    <td>
                      <Cs_StatusBadge cs_status={cs_service.approvalStatus} />
                      <p className="mt-1 text-xs whitespace-nowrap">{cs_approvalHint[cs_service.approvalStatus]}</p>
                    </td>
                    <td>
                      <Cs_AvailabilitySwitch cs_serviceId={cs_service._id} cs_isAvailable={cs_service.isAvailable} />
                    </td>
                    <td>
                      <Cs_Actions cs_data={cs_service} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <ul className="grid gap-4 md:grid-cols-2 xl:hidden">
            {cs_services.map((cs_service) => (
              <li key={cs_service._id} className="cs_mobile_card">
                <div className="flex items-start gap-3">
                  <Image src={cs_service.image} alt="" width={56} height={56} className="size-14 shrink-0 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-medium text-(--cs_heading_color)">{cs_service.title}</p>
                    <p className="text-xs text-(--cs_body_color)">
                      {cs_service.category} · {cs_formatMoney(cs_service.basePrice)}
                    </p>
                  </div>
                  <Cs_StatusBadge cs_status={cs_service.approvalStatus} />
                </div>
                <p className="mt-3 text-xs text-(--cs_body_color)">
                  {cs_service.serviceMode} · {cs_service.serviceArea}
                </p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-(--cs_border_color) pt-4">
                  <Cs_AvailabilitySwitch cs_serviceId={cs_service._id} cs_isAvailable={cs_service.isAvailable} />
                  <Cs_Actions cs_data={cs_service} />
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </>
  );
};

export default Cs_MyServicesPage;
