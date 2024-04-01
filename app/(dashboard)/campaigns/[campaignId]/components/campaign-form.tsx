"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { Campaign, Program, Location, Member, Group } from "@prisma/client";
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
import { on } from "events";
import MultiSelectGroup from "@/components/custom_ui/GroupSelect";

const formSchema = z.object({
  name: z.string().min(1),
  message: z.string().min(1),
  members: z.array(z.string()),
  price: z.coerce.number().min(0),
  groups: z.array(z.string()),
});

type CampaignFormValues = z.infer<typeof formSchema>;

interface CampaignFormProps {
  initialData: Campaign | null;
  members?: Member[];
  groups?: Group[];
}

export const CampaignForm: React.FC<CampaignFormProps> = ({
  initialData,
  members: allMembers,
  groups: allGroups,
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selected, setSelected] = useState<Member[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group[]>([]);

  const title = initialData ? "Uredi grupu" : "Dodaj grupu";
  const description = initialData ? "Uredi otvorenu grupu" : "Dodaj novu grupu";
  const toastMessage = initialData ? "Campaign updated." : "Campaign created.";
  const action = initialData ? "Save changes" : "Create";
  console.log("🚀 ~ initialData:", initialData);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      message: "",
      price: 0,
      members: [],
      groups: [],
    },
  });
  const onMemberChange = (members: Member[]) => {
    setMembers(members);
    form.setValue(
      "members",
      members.map((member) => member.id)
    );
  };

  const onGroupChange = (groups: Group[]) => {
    setGroups(groups);
    form.setValue(
      "groups",
      groups.map((group) => group.id)
    );
  };

  const handleFinalSelection = () => {
    onMemberChange(selected);
    onGroupChange(selectedGroup);
  };

  const getMembers = async () => {
    try {
      const res = await axios.get("/api/members");
      setMembers(res.data);
      setLoading(false);
    } catch (err) {
      console.log("[CampaignForm_GET_MEMBERS]", err);
      toast.error("Error fetching members");
    }
  };

  useEffect(() => {
    getMembers();
  }, []);

  const getGroups = async () => {
    try {
      const res = await axios.get("/api/grupe");
      setGroups(res.data);
      setLoading(false);
    } catch (err) {
      console.log("[CampaignForm_GET_GROUPS]", err);
      toast.error("Error fetching groups");
    }
  };
  useEffect(() => {
    getGroups();
  }, []);

  const onSubmit = async (data: CampaignFormValues) => {
    try {
      const requestData = {
        name: data.name,
        price: data.price,
        message: data.message,
        members: data.members.map((memberId: string) => ({ memberId })),
        groups: data.groups.map((groupId: string) => ({ groupId })),
        id: params?.campaignId,
      };
      setLoading(true);
      if (initialData) {
        await axios.put(`/api/campaigns/${params.campaignId}`, requestData);
      } else {
        await axios.post(`/api/campaigns`, requestData);
      }
      window.location.assign(`${origin}/campaigns`);

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
      await axios.delete(`/api/campaigns/${params.campaignId}`);
      router.refresh();
      router.push("/campaigns");
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
          <div className="grid grid-cols-3 gap-8 mb-8">
            <div className="flex flex-col gap-3">
              <div className="rounded-xl border bg-card text-card-foreground shadow">
                <div className="flex flex-col justify-center  p-2 gap-12">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-6">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-1 pl-2">
                          Ime kampanje
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-sm font-medium leading-none bg-transparent border-0 border-b-0 p-0 pb-1 h-auto  focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none "
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
                    name="message"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-2">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-0">
                          Poruka
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-sm font-medium leading-none bg-transparent border-0 border-b-0 p-0 pb-2 h-auto  focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none "
                            disabled={loading}
                            placeholder=""
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
                    name="price"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center h-2">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-0">
                          Price
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="text-sm font-medium leading-none bg-transparent border-0 border-b-0 p-0 pb-2 h-auto  focus-visible:ring-offset-0 focus-visible:ring-0 rounded-none "
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
                      <FormItem className="flex flex-col items-start ">
                        <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-0">
                          Članovi
                        </FormLabel>
                        <FormControl>
                          <MultiSelectMember
                            placeholder="ccc"
                            members={members}
                            loading={loading}
                            action={action}
                            selected={selected}
                            setSelected={setSelected}
                            selectedMembers={members.filter(
                              (member) =>
                                (initialData as any)?.members?.find(
                                  (selectedMember: any) =>
                                    selectedMember.memberId === member.id
                                )!!
                            )}
                          />
                        </FormControl>
                        <FormMessage className="text-red-1" />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            <div className="rounded-xl border bg-card text-card-foreground shadow">
              <div className="flex flex-col justify-center  p-4 gap-12">
                <FormField
                  control={form.control}
                  name="groups"
                  render={({ field }) => (
                    <FormItem className="flex flex-col items-start">
                      <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-2">
                        Grupe
                      </FormLabel>
                      <FormControl>
                        <MultiSelectGroup
                          onGroupChange={onGroupChange}
                          handleFinalSelection={handleFinalSelection}
                          groups={groups}
                          loading={loading}
                          action={action}
                          selected={selectedGroup}
                          setSelected={setSelectedGroup}
                          selectedGroups={groups.filter(
                            (group) =>
                              (initialData as any)?.groups?.find(
                                (selectedGroup: any) =>
                                  selectedGroup.groupId === group.id
                              )!!
                          )}
                        />
                      </FormControl>
                      <FormMessage className="text-red-1" />
                    </FormItem>
                  )}
                />
              </div>
              {/* <div className="flex flex-col justify-center  p-4 gap-12">
                <FormField
                  control={form.control}
                  name="trainers"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center h-4">
                      <FormLabel className="text-sm text-muted-foreground min-w-[133px] pt-2">
                        trainers
                      </FormLabel>
                      <FormControl>
                        <MultiSelectTrainer
                          placeholder="trainers"
                          trainers={trainers}
                          loading={loading}
                          action={action}
                          handleFinalSelection={handleLastSelection}
                          selected={selectedTrainer}
                          setSelected={setSelectedTrainer}
                          selectedTrainers={trainers.filter(
                            (trainer) =>
                              (initialData as any)?.members?.find(
                                (selectedTrainer: any) =>
                                  selectedTrainer.trainerCampaignId === trainer.id
                              )!!
                          )}
                          onTrainerChange={onTrainerChange}
                        />
                      </FormControl>
                      <FormMessage className="text-red-1" />
                    </FormItem>
                  )}
                />
              </div> */}
            </div>
          </div>
          <Button
            disabled={loading}
            className="ml-auto"
            onClick={handleFinalSelection}
          >
            {action}
          </Button>
        </form>
      </Form>
      <Separator className="mt-4" />
    </div>
  );
};
