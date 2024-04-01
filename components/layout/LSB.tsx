/** @format */

"use client";

import Link from "next/link";
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

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { usePathname } from "next/navigation";
import { DashboardIcon } from "@radix-ui/react-icons";
import { AccordionItem } from "@radix-ui/react-accordion";
import { Accordion, AccordionContent, AccordionTrigger } from "../ui/accordion";

interface NavProps {}

export function SideNav({}: NavProps) {
  const pathName = usePathname();
  return (
    <div className="relative min-w-[240px] border-r px-3">
      <div className="px-4 font-bold pt-4 text-xl">[logo]</div>
      <div className="pb-10 pt-14 mt-0 ">
        <TooltipProvider>
          <div className="group flex flex-col gap-4 pb-2 data-[collapsed=true]:py-2">
            <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
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
                  <Link key="2" href="/users">
                    <AccordionContent className="pl-12 mt-1.5">
                      Članovi
                    </AccordionContent>
                  </Link>
                  <Link key="2" href="/users">
                    <AccordionContent className="pl-12">
                      Treneri
                    </AccordionContent>
                  </Link>
                  <Link key="2" href="/users">
                    <AccordionContent className="pl-12">
                      Skupštinari
                    </AccordionContent>
                  </Link>
                  <Link key="2" href="/users">
                    <AccordionContent className="pl-12">
                      Neaktivni članovi
                    </AccordionContent>
                  </Link>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className=" pl-2 gap-4 py-1.5 max-w-52 w-full">
                    <div className="flex flex-row gap-4 items-center  ">
                      <Layers /> Programi
                    </div>
                  </AccordionTrigger>
                  <Link key="2" href="/groups">
                    <AccordionContent className="pl-12  mt-1.5 ">
                      Škola gimnastike
                    </AccordionContent>
                  </Link>
                  <Link key="2" href="/groups">
                    <AccordionContent className="pl-12">
                      Napredna gimnastika
                    </AccordionContent>
                  </Link>
                  <Link key="2" href="/groups">
                    <AccordionContent className="pl-12">
                      Parkur
                    </AccordionContent>
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
              <Link key="1" href="/auth">
                <div className="flex flex-row gap-4 items-center text-sm font-medium pl-2 hover:underline ">
                  {" "}
                  <LogOutIcon className="w-6 h-6  my-1.5" />
                  Odjavite se
                </div>
              </Link>
            </nav>
          </div>
        </TooltipProvider>
      </div>
    </div>
  );
}
