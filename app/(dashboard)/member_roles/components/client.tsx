"use client";

import { Heading } from "@/components/custom_ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React from "react";
import { MemberRoleColumn, columns } from "./columns";
import { DataTable } from "@/components/custom_ui/data-table";

interface MemberRoleClientProps {
  data: MemberRoleColumn[];
}

export const MemberRoleClient: React.FC<MemberRoleClientProps> = ({ data }) => {
  const router = useRouter();
  const params = useSearchParams();

  return (
    <div>
      <div className="flex items-center justify-between ">
        <Heading
          title={`Tipovi članova (${data.length})`}
          description=" Uredi tipove članova."
        />
        <Button onClick={() => router.push(`/member_roles/new`)}>
          <Plus className="w-4 h-4 mr-2" />
          Add new
        </Button>
      </div>
      <Separator className="mt-4 mb-8" />
      <DataTable searchKey="name" columns={columns} data={data} />
    </div>
  );
};
