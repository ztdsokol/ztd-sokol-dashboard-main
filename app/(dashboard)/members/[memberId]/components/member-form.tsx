"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Member, Program, Location, MemberRole } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Heading } from "@/components/custom_ui/heading";
import { AlertModal } from "@/components/modals/alert-modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MultiSelectMemberRole from "@/components/custom_ui/MemberRoleSelect";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/custom_ui/image-upload";

const formSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().min(1),
  oib_number: z.coerce.number().min(1),
  memberRoles: z.array(z.string()),
  contact_name: z.string().min(1),
  birthdate: z.date().nullable().optional(),
  phone: z.string().min(1),
  address: z.string().min(1),
  notes: z.string().nullable().optional(),
  discount: z.coerce.number().min(0),
  one_time_discount: z.coerce.number().min(0),
  isActive: z.boolean().default(true).optional(),
  image: z.string().nullable().optional(),
});

type MemberFormValues = z.infer<typeof formSchema>;

interface MemberFormProps {
  initialData: Member | null;
  memberRoles?: MemberRole[];
}

export const MemberForm: React.FC<MemberFormProps> = ({
  initialData,
  memberRoles: allMemberRoles,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [memberRoles, setMemberRoles] = useState<MemberRole[]>([]);
  const [selected, setSelected] = useState<MemberRole[]>([]);
  const [birthDate, setBirthDate] = useState(new Date());

  const title = initialData ? "Uredi člana" : "Dodaj člana";
  const description = initialData
    ? "Uredi otvorenog člana"
    : "Dodaj novog člana";
  const toastMessage = initialData ? "Član je uređen." : "Član je napravljen.";
  const action = initialData ? "Spremi promjene" : "Kreiraj";

  const form = useForm<MemberFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          discount: parseFloat(initialData.discount.toString()),
          one_time_discount: parseFloat(
            initialData.one_time_discount.toString()
          ),
        }
      : {
          name: "",
          email: "",
          oib_number: 0,
          memberRoles: [],
          contact_name: "",
          birthdate: new Date(),
          phone: "",
          address: "",
          notes: "",
          discount: 0,
          one_time_discount: 0,
          isActive: true,
          image: "",
        },
  });
  const onMemberRoleChange = (memberRoles: MemberRole[]) => {
    setMemberRoles(memberRoles);
    form.setValue(
      "memberRoles",
      memberRoles.map((memberRole) => memberRole.id)
    );
  };
  const handleFinalSelection = () => {
    onMemberRoleChange(selected);
  };

  const getMemberRoles = async () => {
    try {
      const res = await axios.get("/api/member_roles");
      setMemberRoles(res.data);
      setLoading(false);
    } catch (err) {
      console.log("[MemberForm_GET_MEMBERRoleS]", err);
      toast.error("Error fetching memberRoles");
    }
  };

  useEffect(() => {
    getMemberRoles();
  }, []);

  const onSubmit = async (data: MemberFormValues) => {
    try {
      const requestData = {
        name: data.name,
        email: data.email,
        oib_number: data.oib_number,
        contact_name: data.contact_name,
        birthdate: data.birthdate,
        phone: data.phone,
        address: data.address,
        notes: data.notes,
        discount: data.discount,
        one_time_discount: data.one_time_discount,
        isActive: data.isActive,
        image: data.image,
        memberRoles: data.memberRoles.map((memberRoleId: string) => ({
          memberRoleId,
        })),
        id: params?.memberId,
      };
      setLoading(true);
      if (initialData) {
        await axios.put(`/api/members/${params.memberId}`, requestData);
      } else {
        await axios.post(`/api/members`, requestData);
      }
      window.location.assign(`${origin}/members`);

      toast.success(toastMessage);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/members/${params.memberId}`);
      router.refresh();
      router.push("/members");
      toast.success("Član je obrisan.");
    } catch (error: any) {
      toast.error(
        "Prije brisanja potrebno je maknuti člana iz svih grupa i obrisati tipove člana."
      );
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <div className="w-full">
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between ">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator className="my-4" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <div className="grid grid-cols-3 gap-8">
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="flex flex-col justify-center  p-4 gap-12">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-4">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-2">
                          Ime i prezime:
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-sm font-medium leading-none bg-transparent border-0 border-b-0 p-0 h-auto  focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none "
                            disabled={loading}
                            placeholder="Unesite ime i prezime člana"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="memberRoles"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-4">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px]">
                          Tip člana
                        </FormLabel>
                        <FormControl>
                          <MultiSelectMemberRole
                            // placeholder="Odaberite tip člana"
                            memberRoles={memberRoles}
                            loading={loading}
                            action={action}
                            selected={selected}
                            handleFinalSelection={handleFinalSelection}
                            setSelected={setSelected}
                            selectedMemberRoles={memberRoles.filter(
                              (memberRole) =>
                                (initialData as any)?.memberRoles?.find(
                                  (selectedMemberRole: any) =>
                                    selectedMemberRole.memberRoleId ===
                                    memberRole.id
                                )!!
                            )}
                            onMemberRoleChange={onMemberRoleChange}
                          />
                        </FormControl>
                        <FormMessage className="text-red-1" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="flex flex-col justify-center  p-4 pt-2 gap-4">
                  <FormField
                    control={form.control}
                    name="birthdate"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-4">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-2">
                          Datum rođenja
                        </FormLabel>
                        <FormControl>
                          <DatePicker
                            selected={field.value}
                            className="text-sm font-medium leading-none bg-transparent border-0 border-b-0 p-0 h-auto  focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none "
                            //onSelect={handleDateSelect} //when day is clicked
                            onChange={(date: Date) => field.onChange(date)} //only when value has changed
                            dateFormat={"dd/MM/yyyy"}
                            placeholderText="Odaberite datum rođenja"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="oib_number"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-4">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-2">
                          OIB
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-sm font-medium leading-none bg-transparent border-0 border-b-0 p-0 h-auto  focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none "
                            type="number"
                            disabled={loading}
                            placeholder="Unesite OIB člana"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="flex flex-col justify-center  p-4 pt-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contact_name"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-4">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-2">
                          Kontakt osoba
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-sm font-medium leading-none bg-transparent border-0 border-b-0 p-0 h-auto  focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none "
                            disabled={loading}
                            placeholder="Unesite kontakt osobu člana"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="flex flex-col justify-center  p-4 pt-2 gap-4">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-4">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-2">
                          Kontakt telefon
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-sm font-medium leading-none bg-transparent border-0 border-b-0 p-0 h-auto  focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none "
                            disabled={loading}
                            placeholder="Unesite telefon člana"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-4">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-2">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-sm font-medium leading-none bg-transparent border-0 border-b-0 p-0 h-auto  focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none "
                            disabled={loading}
                            placeholder="Email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-4">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-2">
                          Adresa
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-sm font-medium leading-none bg-transparent border-0 border-b-0 p-0 h-auto  focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none "
                            disabled={loading}
                            placeholder="Unesite adresu člana"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="flex flex-col justify-center  p-4 pt-2 gap-4">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Napomene</FormLabel>
                        <FormControl>
                          <Textarea
                            disabled={loading}
                            placeholder="Unesite adresu člana"
                            {...field}
                            value={field.value ?? ""}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="flex flex-col justify-center  p-4 pt-2 gap-4">
                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-2 rounded-md  ">
                        <FormLabel className="text-sm text-muted-foreground mr-2 pt-2">
                          Status člana
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none ">
                          <FormLabel>
                            {field.value ? "Aktivan" : "Neaktivan"}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="flex flex-col justify-center  p-4 pt-2 gap-4">
                  <FormField
                    control={form.control}
                    name="discount"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-4">
                        <FormLabel className="text-sm text-muted-foreground mr-2 pt-2">
                          Popust
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-sm font-medium leading-none bg-transparent border-0 border-b-0 p-0 h-auto  focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none "
                            type="number"
                            disabled={loading}
                            placeholder="Unesite adresu člana"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="flex flex-col justify-center  p-4 pt-2 gap-4">
                  <FormField
                    control={form.control}
                    name="one_time_discount"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-4">
                        <FormLabel className="text-sm text-muted-foreground min-w-[143px] pt-2 mr-2">
                          Jednopkratni popust
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-sm font-medium leading-none bg-transparent border-0 border-b-0 p-0 h-auto  focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none "
                            type="number"
                            disabled={loading}
                            placeholder="Unesite adresu člana"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="flex flex-col justify-center  p-4 gap-4"></div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value ? [field.value] : []}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={loading}
              className="ml-auto "
              onClick={handleFinalSelection}
            >
              {action}
            </Button>
          </div>
        </form>
      </Form>
      <Separator className="mt-4" />
    </div>
  );
};
