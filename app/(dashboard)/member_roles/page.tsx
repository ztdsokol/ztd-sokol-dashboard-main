import { format } from "date-fns";
import { MemberRoleClient } from "./components/client";
import prismadb from "@/lib/prismadb";
import { MemberRoleColumn } from "./components/columns";
import { id } from "date-fns/locale";

const MemberRolePage = async () => {
  const memberRoles = await prismadb.memberRole.findMany({
    orderBy: { name: "asc" },
  });

  const formattedMemberRoles: MemberRoleColumn[] = memberRoles.map((item) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
  }));

  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MemberRoleClient data={formattedMemberRoles} />
      </div>
    </div>
  );
};

export default MemberRolePage;
