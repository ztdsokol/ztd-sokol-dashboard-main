import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

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

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 403 });
    // }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    const memberIds = members.map((member: { memberId: string }) => ({
      memberId: member.memberId,
    }));

    const group = await prismadb.group.create({
      data: {
        id: randomNumberString,
        name,
        locationId,
        programId,
        price,
        trainers,
        members: {
          createMany: {
            data: memberIds,
          },
        },
      },
      include: { members: true },
    });
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
