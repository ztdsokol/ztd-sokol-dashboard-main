"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

//import { CellAction } from "./cell-action"

export type CampaignColumn = {
  id: string;
  name: string;
  createdAt: string;
};

export const columns: ColumnDef<CampaignColumn>[] = [
  {
    accessorKey: "name",
    header: "Ime grupe",
  },

  {
    accessorKey: "createdAt",
    header: "Datum kreiranja grupe",
  },
  {
    accessorKey: "members:",
    header: "members:",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
