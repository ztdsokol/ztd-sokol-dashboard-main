import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
interface MemberInput {
  memberId: string;
}
interface GroupInput {
  groupId: string;
}

export async function PUT(req: Request) {
  try {
    // const { userId } = auth();
    const body = await req.json();

    const { id, name, members, price, message, groups } = body;
    console.log("🚀 ~ PUT ~ members:", members);

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 403 });
    // }

    if (!id) {
      return new NextResponse("Campaign ID is required", { status: 400 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    const memberIds = members.map((member: { memberId: string }) => ({
      memberId: member.memberId,
    }));
    const memberData = members.map((member: MemberInput) => ({
      memberId: member.memberId,
    }));

    const groupIds = groups.map((group: { groupId: string }) => ({
      groupId: group.groupId,
    }));
    const groupData = groups.map((group: GroupInput) => ({
      groupId: group.groupId,
    }));

    await prismadb.campaign.update({
      where: { id },
      data: {
        name,
        message,
        price,
        members: {
          deleteMany: {},
        },
        groups: {
          deleteMany: {},
        },
      },
      include: {
        members: true,
        groups: true,
      },
    });
    const updatedCampaign = await prismadb.campaign.update({
      where: { id: id },
      data: {
        members: {
          createMany: {
            data: memberData.map((member: any, index: any) => ({
              memberId: member.memberId,
            })),
          },
        },
        groups: {
          createMany: {
            data: groupData.map((group: any, index: any) => ({
              groupId: group.groupId,
            })),
          },
        },
      },
    });
    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.log("[CampaignS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { campaignId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.campaignId) {
      return new NextResponse("Campaign id is required", { status: 400 });
    }

    const campaign = await prismadb.campaign.deleteMany({
      where: {
        id: params.campaignId,
      },
    });

    return NextResponse.json(campaign);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
