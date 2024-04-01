import prismadb from "@/lib/prismadb";
import React from "react";
import { CampaignForm } from "./components/campaign-form";

const CampaignPage = async ({ params }: { params: { campaignId: string } }) => {
  let campaign = null;

  if (params.campaignId !== "new") {
    campaign = await prismadb.campaign.findUnique({
      where: {
        id: params.campaignId,
      },
      include: {
        members: true,
        groups: true,
      },
    });
  }
  // const campaign = await prismadb.campaign.findUnique({
  //   where: {
  //     id: params.campaignId,
  //   },
  // });

  console.log("🚀 ~ CampaignPage ~ campaign:", campaign);
  const locations = await prismadb.location.findMany();
  const programs = await prismadb.program.findMany();
  const membersWithTrainerRole = await prismadb.member.findMany({
    where: {
      memberRoles: {
        some: {
          memberRoles: {
            name: "trainer",
          },
        },
      },
    },
    include: {
      memberRoles: true,
    },
  });

  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <CampaignForm initialData={campaign} />
        </div>
      </div>
    </div>
  );
};

export default CampaignPage;
