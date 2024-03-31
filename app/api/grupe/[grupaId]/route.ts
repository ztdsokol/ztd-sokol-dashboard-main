import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function PUT(req: Request) {
  try {
    // const { userId } = auth();
    const body = await req.json();

    const { id, name, locationId, programId, members, price } = body;
    console.log("🚀 ~ PUT ~ members:", members);

    // if (!userId) {
    //   return new NextResponse("Unauthorized", { status: 403 });
    // }

    if (!id) {
      return new NextResponse("Group ID is required", { status: 400 });
    }
    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }
    const memberIds = members.map((member: { memberId: string }) => ({
      memberId: member.memberId,
    }));

    await prismadb.group.update({
      where: { id },
      data: {
        name,
        locationId,
        programId,
        price,
        members: {
          deleteMany: {},
        },
      },
      include: { members: true },
    });
    const updatedGroup = await prismadb.group.update({
      where: { id: id },
      data: {
        members: {
          createMany: {
            data: memberIds,
          },
        },
      },
    });
    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.log("[GROUPS_PUT]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { grupaId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.grupaId) {
      return new NextResponse("group id is required", { status: 400 });
    }

    const group = await prismadb.group.deleteMany({
      where: {
        id: params.grupaId,
      },
    });

    return NextResponse.json(group);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
