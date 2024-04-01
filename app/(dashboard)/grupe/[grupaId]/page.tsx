import prismadb from "@/lib/prismadb";
import React from "react";
import { GroupForm } from "./components/group-form";

const GroupPage = async ({ params }: { params: { grupaId: string } }) => {
  let group = null;
  
  if (params.grupaId !== "new") {
    group = await prismadb.group.findUnique({
      where: {
        id: params.grupaId,
      },
      include: {
        members: true,
      },
    });
  }
  // const group = await prismadb.group.findUnique({
    //   where: {
      //     id: params.grupaId,
      //   },
      // });
      
      console.log("🚀 ~ GroupPage ~ group:", group)
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
          <GroupForm
            locations={locations}
            programs={programs}
            initialData={group}
            trainers={membersWithTrainerRole}
          />
        </div>
      </div>
    </div>
  );
};

export default GroupPage;
