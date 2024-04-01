import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
interface MemberInput {
  memberId: string;
}
interface GroupInput {
  groupId: string;
}

function generateRandomNumberString(length: number) {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10); // generates a random digit from 0 to 9
  }
  return result;
}

const randomNumberString = generateRandomNumberString(1); // generates a 32-digit random number string

export async function POST(req: Request) {
  try {
    // const { userId } = auth();
    const body = await req.json();

    const { name, members, price, message, groups } = body;
    console.log("🚀 ~ POST ~ members:", members);

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 403 });
    // }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    const memberData = members.map((member: MemberInput) => ({
      memberId: member.memberId,
    }));

    const groupData = groups.map((group: GroupInput) => ({
      groupId: group.groupId,
    }));

    const campaign = await prismadb.campaign.create({
      data: {
        name,
        message,
        price,
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
      include: { members: true, groups: true },
    });

    console.log("🚀 ~ POST ~ campaign:", campaign);
    return NextResponse.json(campaign);
  } catch (error) {
    console.log("[GOUPS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const campaigns = await prismadb.campaign.findMany({});

    return NextResponse.json(campaigns);
  } catch (error) {
    console.log("[GOUPS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
