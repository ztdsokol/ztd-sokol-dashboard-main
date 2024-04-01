"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

//import { CellAction } from "./cell-action"

export type MemberRoleColumn = {
  id: string;
  name: string;
  createdAt: string;
};

export const columns: ColumnDef<MemberRoleColumn>[] = [
  {
    accessorKey: "name",
    header: "Ime tipa člana",
  },
  {
    accessorKey: "createdAt",
    header: "Datum kreiranja tipa člana",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
