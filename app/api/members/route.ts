import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    // const { userId } = auth();
    const body = await req.json();

    const {
      name,
      email,
      memberRoles,
      birthdate,
      oib_number,
      contact_name,
      isActive,
      image,
      phone,
      address,
      notes,
      discount,
      one_time_discount,
    } = body;

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 403 });
    // }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    const memberRoleIds = memberRoles.map(
      (memberRole: { memberRoleId: string }) => ({
        memberRoleId: memberRole.memberRoleId,
      })
    );

    const member = await prismadb.member.create({
      data: {
        name,
        birthdate,
        email,
        oib_number,
        contact_name,
        phone,
        address,
        discount,
        one_time_discount,
        notes,
        isActive,
        image,
        memberRoles: {
          createMany: {
            data: memberRoleIds,
          },
        },
      },
      include: { memberRoles: true },
    });
    return NextResponse.json(member);
  } catch (error) {
    console.log("[MEMBERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const members = await prismadb.member.findMany({});

    return NextResponse.json(members);
  } catch (error) {
    console.log("[MEMBERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
