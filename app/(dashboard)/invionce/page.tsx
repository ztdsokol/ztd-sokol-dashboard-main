"use client";

import { Heading } from "@/components/custom_ui/heading";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const Invionce = () => {
  const router = useRouter();
  return (
    <div className="w-full">
      <div className="flex items-center justify-between ">
        <Heading title={`Invoice (9)`} description=" Manage invoice" />
      </div>
      {/* <Separator className="mt-4 mb-8" />
      <DataTable searchKey="name" columns={columns} data={data} /> */}
    </div>
  );
};

export default Invionce;
