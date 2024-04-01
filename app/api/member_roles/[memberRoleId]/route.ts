import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { memberRoleId: string } }
) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    if (!params.memberRoleId) {
      return new NextResponse("Store id is required", { status: 400 });
    }

    const memberRole = await prismadb.memberRole.updateMany({
      where: {
        id: params.memberRoleId,
      },
      data: {
        name,
      },
    });

    return NextResponse.json(memberRole);
  } catch (error) {
    console.log("[memberRole_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { memberRoleId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse("Unauthenticated", { status: 403 });
    }

    if (!params.memberRoleId) {
      return new NextResponse("memberRole id is required", { status: 400 });
    }

    const memberRole = await prismadb.memberRole.deleteMany({
      where: {
        id: params.memberRoleId,
      },
    });

    return NextResponse.json(memberRole);
  } catch (error) {
    console.log("[STORE_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
