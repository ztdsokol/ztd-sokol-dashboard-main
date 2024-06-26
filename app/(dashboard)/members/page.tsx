import { format } from "date-fns";
import { MemberClient } from "./components/client";
import prismadb from "@/lib/prismadb";
import { MemberColumn } from "./components/columns";
import { create } from "domain";
import { id } from "date-fns/locale";

const MemberPage = async () => {
  const members = await prismadb.member.findMany({
    include: {
      memberRoles: {
        include: {
          memberRoles: true, // This includes the MemberRole through MemberMemberRole
        },
      },
    },
  });
  const formattedMembers: MemberColumn[] = members.map((item) => ({
    id: item.id,
    name: item.name,
    email: item.email,
    phone: item.phone,
    address: item.address,
    contact_name: item.contact_name,
    birthdate: item.birthdate ?? new Date(),
    createdAt: format(item.createdAt, "MMMM do, yyyy"),
    memberRoles: item.memberRoles.map(
      (memberMemberRole) => memberMemberRole.memberRoles.name
    ),
  }));

  return (
    <div className="flex-col w-full">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MemberClient data={formattedMembers} />
      </div>
    </div>
  );
};

export default MemberPage;
