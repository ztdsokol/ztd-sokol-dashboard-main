"use client";

import { ColumnDef } from "@tanstack/react-table";
import { CellAction } from "./cell-action";

//import { CellAction } from "./cell-action"

export type MemberColumn = {
  id: string;
  name: string;
  createdAt: string;
  birthdate: Date;
  contact_name: string;
  address: string;
  phone: string;
  email: string;
  memberRoles: string[];
};

const allMembers: MemberColumn[] = []; // Replace this with your actual data fetching logic

// Filter members to include only those with a specific role, e.g., "Admin"
const filteredMembers = allMembers.filter((member) =>
  member.memberRoles.includes("Trainer")
);
export const columns: ColumnDef<MemberColumn>[] = [
  {
    accessorKey: "name",
    header: "Ime i prezime",
  },
  {
    accessorKey: "birthdate",
    header: "Datum rođenja:",
    cell: ({ row }) => <div>{row.original.birthdate.toLocaleDateString()}</div>,
  },
  {
    accessorKey: "memberRoles",
    header: "Uloge:",
    cell: ({ row }) => <div>{row.original.memberRoles.join(", ")}</div>,
  },
  {
    accessorKey: "contact_name",
    header: "Ime kontakta:",
  },
  {
    accessorKey: "address",
    header: "Adresa:",
  },
  {
    accessorKey: "phone",
    header: "Telefon:",
  },
  {
    accessorKey: "email",
    header: "Email:",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
