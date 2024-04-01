import prismadb from "@/lib/prismadb";
import React from "react";
import { MemberRoleForm } from "./components/member-role-form";

const MemberRolePage = async ({
  params,
}: {
  params: { memberRoleId: string };
}) => {
  const memberRole = await prismadb.memberRole.findUnique({
    where: {
      id: params.memberRoleId,
    },
  });
  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between">
          <MemberRoleForm initialData={memberRole} />
        </div>
      </div>
    </div>
  );
};

export default MemberRolePage;
