import { format } from "date-fns";
import { CampaignClient } from "./components/client";
import prismadb from "@/lib/prismadb";
import { CampaignColumn } from "./components/columns";
import { create } from "domain";
import { id } from "date-fns/locale";

const CampaignsPage = async () => {
  const campaigns = await prismadb.campaign.findMany({
    include: { members: true },
    orderBy: { name: "asc" },
  });
  const formattedCampaigns: CampaignColumn[] = campaigns.map((item) => ({
    id: item.id,
    name: item.name,

    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    members: item.members.map((member: any) => ({
      id: member.memberId,
    })),
  }));

  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CampaignClient data={formattedCampaigns} />
      </div>
    </div>
  );
};

export default CampaignsPage;
