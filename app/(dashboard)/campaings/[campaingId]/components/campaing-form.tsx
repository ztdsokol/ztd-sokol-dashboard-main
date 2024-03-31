"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Group, Program, Location, Member } from "@prisma/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import MultiSelectMember from "@/components/custom_ui/MSelect";

const formSchema = z.object({
  name: z.string().min(1),
  locationId: z.string().min(1),
  programId: z.string().min(1),
  members: z.array(z.string()),
  trainers: z.array(z.string()),
  price: z.coerce.number().min(0),
});

type GroupFormValues = z.infer<typeof formSchema>;

interface GroupFormProps {
  initialData: Group | null;
  programs: Program[];
  locations: Location[];
  members?: Member[];
  trainers?: Member[];
}

export const GroupForm: React.FC<GroupFormProps> = ({
  initialData,
  programs,
  locations,
  members: allMembers,
  trainers: allTrainers,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [selected, setSelected] = useState<Member[]>([]);

  const title = initialData ? "Uredi grupu" : "Dodaj grupu";
  const description = initialData ? "Uredi otvorenu grupu" : "Dodaj novu grupu";
  const toastMessage = initialData ? "Group updated." : "Group created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<GroupFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      locationId: "",
      programId: "",
      price: 0,
      members: [],
      trainers: [],
    },
  });
  const onMemberChange = (members: Member[]) => {
    setMembers(members);
    form.setValue(
      "members",
      members.map((member) => member.id)
    );
  };
  const handleFinalSelection = () => {
    onMemberChange(selected);
  };

  const getMembers = async () => {
    try {
      const res = await axios.get("/api/members");
      setMembers(res.data);
      setLoading(false);
    } catch (err) {
      console.log("[GroupForm_GET_MEMBERS]", err);
      toast.error("Error fetching members");
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  const onSubmit = async (data: GroupFormValues) => {
    try {
      const requestData = {
        name: data.name,
        price: data.price,
        locationId: data.locationId,
        programId: data.programId,
        members: data.members.map((memberId: string) => ({ memberId })),
        trainers: data.trainers.map((trainerId: string) => ({ trainerId })),
        id: params?.grupaId,
      };
      setLoading(true);
      if (initialData) {
        await axios.put(`/api/grupe/${params.grupaId}`, requestData);
      } else {
        await axios.post(`/api/grupe`, requestData);
      }
      window.location.assign(`${origin}/grupe`);

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
      await axios.delete(`/api/grupe/${params.grupaId}`);
      router.refresh();
      router.push("/grupe");
      toast.success("Grupa je obrisana.");
    } catch (error: any) {
      toast.error("Make sure you removed all products and categories first.");
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
                          Ime grupe
                        </FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="Ime grupe"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="programId"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-4">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-2">
                          Program
                        </FormLabel>
                        <FormControl>
                          <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Odaberite program"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {programs.map((program) => (
                                <SelectItem key={program.id} value={program.id}>
                                  {program.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="flex flex-col justify-center  p-4 gap-12">
                  <FormField
                    control={form.control}
                    name="locationId"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-4">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-2">
                          Lokacija
                        </FormLabel>
                        <FormControl>
                          <Select
                            disabled={loading}
                            onValueChange={field.onChange}
                            value={field.value}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  defaultValue={field.value}
                                  placeholder="Odaberite lokaciju"
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {locations.map((location) => (
                                <SelectItem
                                  key={location.id}
                                  value={location.id}
                                >
                                  {location.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="flex flex-col justify-center  p-4 gap-12">
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-4">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-2">
                          Price
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={loading}
                            placeholder="Ime grupe"
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
                <div className="flex flex-col justify-center  p-4 gap-12">
                  <FormField
                    control={form.control}
                    name="members"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-4">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-2">
                          Članovi
                        </FormLabel>
                        <FormControl>
                          <MultiSelectMember
                            placeholder="ccc"
                            members={members}
                            loading={loading}
                            action={action}
                            selected={selected}
                            handleFinalSelection={handleFinalSelection}
                            setSelected={setSelected}
                            selectedMembers={members.filter(
                              (member) =>
                                (initialData as any)?.members?.find(
                                  (selectedMember: any) =>
                                    selectedMember.memberId === member.id
                                )!!
                            )}
                            onMemberChange={onMemberChange}
                          />
                        </FormControl>
                        <FormMessage className="text-red-1" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <Button
                disabled={loading}
                className="ml-auto"
                onClick={handleFinalSelection}
              >
                {action}
              </Button>
            </div>
            <div className="flex flex-col gap-3">
              {" "}
              <FormField
                control={form.control}
                name="trainers"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center h-4">
                    <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-2">
                      Članovi
                    </FormLabel>
                    <FormControl>
                      <MultiSelectMember
                        placeholder="ccc"
                        members={members}
                        loading={loading}
                        action={action}
                        selected={selected}
                        handleFinalSelection={handleFinalSelection}
                        setSelected={setSelected}
                        selectedMembers={members.filter(
                          (member) =>
                            (initialData as any)?.members?.find(
                              (selectedMember: any) =>
                                selectedMember.memberId === member.id
                            )!!
                        )}
                        onMemberChange={onMemberChange}
                      />
                    </FormControl>
                    <FormMessage className="text-red-1" />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
      <Separator className="mt-4" />
    </div>
  );
};
