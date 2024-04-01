import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";
interface MemberInput {
  memberId: string;
}

interface TrainerInput {
  trainerGroupId: string;
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

    const { name, locationId, programId, members, price, trainers } = body;
    console.log("🚀 ~ POST ~ trainers:", trainers);

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 403 });
    // }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    const memberData = members.map((member: MemberInput) => ({
      memberId: member.memberId,
    }));

    const trainerIds = trainers.map(
      (trainer: TrainerInput) => trainer.trainerGroupId
    );

    const group = await prismadb.group.create({
      data: {
        name,
        locationId,
        programId,
        price,
        members: {
          createMany: {
            data: memberData.map((member: any, index: any) => ({
              memberId: member.memberId,
              trainerGroupId: trainerIds[index] || null,
            })),
          },
        },
      },
      include: { members: true },
    });

    console.log("🚀 ~ POST ~ group:", group);
    return NextResponse.json(group);
  } catch (error) {
    console.log("[GOUPS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const groups = await prismadb.group.findMany({});

    return NextResponse.json(groups);
  } catch (error) {
    console.log("[GOUPS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
