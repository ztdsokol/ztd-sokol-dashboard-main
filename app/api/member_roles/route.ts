import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const body = await req.json();

    const { name } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 403 });
    }

    if (!name) {
      return new NextResponse("Name is required", { status: 400 });
    }

    const memberRole = await prismadb.memberRole.create({
      data: {
        name,
      },
    });

    return NextResponse.json(memberRole);
  } catch (error) {
    console.log("[memberRoleS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const memberRoles = await prismadb.memberRole.findMany({});

    return NextResponse.json(memberRoles);
  } catch (error) {
    console.log("[memberRoleS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
