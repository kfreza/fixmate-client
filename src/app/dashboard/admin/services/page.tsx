import Image from "next/image";
import type { Metadata } from "next";
import { PackageOpenIcon } from "lucide-react";
import { cs_requireRole } from "@/lib/cs_session";
import { cs_serverApi } from "@/lib/cs_serverApi";
import { cs_formatDay, cs_formatMoney } from "@/lib/cs_format";
import type { Cs_ListResponse, Cs_Service } from "@/lib/cs_types";
import Cs_DashboardHeading from "@/app/ui/DashboardHeading";
import Cs_StatusTabs from "@/app/ui/StatusTabs";
import Cs_StatusBadge from "@/app/ui/StatusBadge";
import Cs_ApprovalActions from "@/app/ui/ApprovalActions";
import Cs_ServicePreviewDialog from "@/app/ui/ServicePreviewDialog";

export const metadata: Metadata = { title: "Service Approvals" };

const CS_TABS = [
  { value: "", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
] as const;

const Cs_Actions = ({ cs_data }: { cs_data: Cs_Service }) => (
  <div className="flex items-center gap-1.5 whitespace-nowrap">
    <Cs_ServicePreviewDialog cs_data={cs_data} />
    <Cs_ApprovalActions
      cs_serviceId={cs_data._id}
      cs_serviceTitle={cs_data.title}
      cs_status={cs_data.approvalStatus}
    />
  </div>
);

const Cs_AdminServicesPage = async ({
  searchParams,
}: PageProps<"/dashboard/admin/services">) => {
  await cs_requireRole("admin");
  const { status: cs_statusParam } = await searchParams;
  const cs_status = CS_TABS.some(
    (cs_tab) => cs_tab.value && cs_tab.value === cs_statusParam,
  )
    ? String(cs_statusParam)
    : "";
  // The server sorts pending first
  const { items: cs_services } = await cs_serverApi<
    Cs_ListResponse<Cs_Service>
  >(`/api/admin/services${cs_status ? `?status=${cs_status}` : ""}`);

  return (
    <>
      <Cs_DashboardHeading
        cs_title="Service Approvals"
        cs_subtitle="Review new and edited listings. Only approved services are visible to customers."
      />
      <Cs_StatusTabs
        cs_basePath="/dashboard/admin/services"
        cs_current={cs_status}
        cs_options={CS_TABS}
      />

      {!cs_services.length ? (
        <div className="cs_empty_state mt-6">
          <PackageOpenIcon className="size-8 text-(--cs_primary_color)" />
          <p className="font-semibold text-(--cs_heading_color)">
            {cs_status === "pending" ? "All caught up" : "No services here"}
          </p>
          <p className="text-sm text-(--cs_body_color)">
            {cs_status === "pending"
              ? "There are no services waiting for review."
              : "Try another filter."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="cs_table_wrap mt-6 hidden xl:block">
            <table className="cs_table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Technician</th>
                  <th>Price</th>
                  <th>Submitted</th>
                  <th>Status</th>
                  <th>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cs_services.map((cs_service) => (
                  <tr key={cs_service._id}>
                    <td>
                      <div className="flex min-w-52 items-center gap-3">
                        <Image
                          src={cs_service.image}
                          alt=""
                          width={44}
                          height={44}
                          className="size-11 shrink-0 rounded-lg object-cover"
                        />
                        <div className="min-w-0">
                          <p className="line-clamp-1 font-medium text-(--cs_heading_color)">
                            {cs_service.title}
                          </p>
                          <p className="text-xs">{cs_service.category}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <p className="whitespace-nowrap text-(--cs_heading_color)">
                        {cs_service.technicianName}
                      </p>
                      <p className="text-xs">{cs_service.technicianEmail}</p>
                    </td>
                    <td className="font-semibold whitespace-nowrap text-(--cs_heading_color)">
                      {cs_formatMoney(cs_service.basePrice)}
                    </td>
                    <td className="whitespace-nowrap">
                      {cs_formatDay(cs_service.createdAt)}
                    </td>
                    <td>
                      <Cs_StatusBadge cs_status={cs_service.approvalStatus} />
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
          <ul className="mt-6 grid gap-4 md:grid-cols-2 xl:hidden">
            {cs_services.map((cs_service) => (
              <li key={cs_service._id} className="cs_mobile_card">
                <div className="flex items-start gap-3">
                  <Image
                    src={cs_service.image}
                    alt=""
                    width={56}
                    height={56}
                    className="size-14 shrink-0 rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-medium text-(--cs_heading_color)">
                      {cs_service.title}
                    </p>
                    <p className="text-xs text-(--cs_body_color)">
                      {cs_service.technicianName} ·{" "}
                      {cs_formatMoney(cs_service.basePrice)}
                    </p>
                  </div>
                  <Cs_StatusBadge cs_status={cs_service.approvalStatus} />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-(--cs_border_color) pt-4">
                  <span className="text-xs text-(--cs_body_color)">
                    Submitted {cs_formatDay(cs_service.createdAt)}
                  </span>
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

export default Cs_AdminServicesPage;
