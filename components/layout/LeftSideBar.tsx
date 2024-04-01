"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants";
import { UserButton } from "@clerk/nextjs";
import {
  Euro,
  FileTextIcon,
  GraduationCapIcon,
  Layers,
  LogOutIcon,
  LucideIcon,
  Mails,
  Receipt,
  ReceiptIcon,
  Settings,
  User2Icon,
  Users,
} from "lucide-react";
import { DashboardIcon } from "@radix-ui/react-icons";
import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
  AccordionItem,
} from "../ui/accordion";
const LeftSideBar = () => {
  const pathname = usePathname();

  return (
    <div className="h-screen left-0 top-0 sticky px-10 py--4 fex flex-col gap-4 border-r-1 border-black max-lg:hidden ">
      <div className="flex flex-col gap-4 min-w-[200px] mt-6">
        <Link key="1" href="/">
          <div className="flex flex-row gap-4 items-center text-sm font-medium pl-2 hover:underline ">
            {" "}
            <DashboardIcon className="w-6 h-6  my-1.5" />
            Nadzorna ploča
          </div>
        </Link>
        <Accordion type="multiple">
          <AccordionItem value="item-1">
            <AccordionTrigger className=" pl-2 py-1.5 gap-4">
              <div className="flex flex-row gap-4 items-center">
                {" "}
                <Users />
                Članstvo
              </div>
            </AccordionTrigger>
            <Link key="2" href="/clanovi">
              <AccordionContent className="pl-12 mt-1.5">
                Članovi
              </AccordionContent>
            </Link>
            <Link key="2" href="/treneri">
              <AccordionContent className="pl-12">Treneri</AccordionContent>
            </Link>
            <Link key="2" href="/skupstinari">
              <AccordionContent className="pl-12">Skupštinari</AccordionContent>
            </Link>
            {/*             <Link key="2" href="/users">
              <AccordionContent className="pl-12">
                Neaktivni članovi
              </AccordionContent>
            </Link> */}
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className=" pl-2 gap-4 py-1.5 max-w-52 w-full">
              <div className="flex flex-row gap-4 items-center  ">
                <Layers /> Programi
              </div>
            </AccordionTrigger>
            <Link key="2" href="/grupe">
              <AccordionContent className="pl-12  mt-1.5 ">
                Škola gimnastike
              </AccordionContent>
            </Link>
            <Link key="2" href="/grupe">
              <AccordionContent className="pl-12">
                Napredna gimnastika
              </AccordionContent>
            </Link>
            <Link key="2" href="/grupe">
              <AccordionContent className="pl-12">Parkur</AccordionContent>
            </Link>
          </AccordionItem>
        </Accordion>
        <Link key="1" href="/campaigns">
          <div className="flex flex-row gap-4 items-center text-sm font-medium pl-2 hover:underline ">
            {" "}
            <Mails className="w-6 h-6 my-1.5" />
            Kampanje
          </div>
        </Link>
        <Link key="1" href="/orders">
          <div className="flex flex-row gap-4 items-center text-sm font-medium pl-2 hover:underline ">
            {" "}
            <FileTextIcon className="w-6 h-6  my-1.5" />
            Financije
          </div>
        </Link>
        <Link key="1" href="/settings">
          <div className="flex flex-row gap-4 items-center text-sm font-medium pl-2 hover:underline ">
            {" "}
            <Settings className="w-6 h-6  my-1.5" />
            Podešavanja
          </div>
        </Link>
      </div>
    </div>
  );
};

export default LeftSideBar;
