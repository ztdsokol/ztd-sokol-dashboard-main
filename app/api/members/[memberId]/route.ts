import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function PUT(req: Request) {
  try {
    // const { userId } = auth();
    const body = await req.json();

    const {
      id,
      name,
      email,
      memberRoles,
      birthdate,
      oib_number,
      contact_name,
      address,
      phone,
      discount,
      one_time_discount,
      notes,
      isActive,
      image,
    } = body;
    console.log("🚀 ~ PUT ~ memberRoles:", memberRoles);

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 403 });
    // }

    if (!id) {
      return new NextResponse("member ID is required", { status: 400 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    const memberRoleIds = memberRoles.map(
      (memberRole: { memberRoleId: string }) => ({
        memberRoleId: memberRole.memberRoleId,
      })
    );

    await prismadb.member.update({
      where: { id },
      data: {
        name,
        email,
        birthdate,
        oib_number,
        contact_name,
        address,
        phone,
        discount,
        one_time_discount,
        notes,
        isActive,
        image,
        memberRoles: {
          deleteMany: {},
        },
      },
      include: { memberRoles: true },
    });
    const updatedmember = await prismadb.member.update({
      where: { id: id },
      data: {
        memberRoles: {
          createMany: {
            data: memberRoleIds,
          },
        },
      },
    });
    return NextResponse.json(updatedmember);
  } catch (error) {
    console.log("[memberS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.memberId) {
      return new NextResponse("member id is required", { status: 400 });
    }

    const member = await prismadb.member.deleteMany({
      where: {
        id: params.memberId,
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
