import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { Group, Member, MemberRole } from "@prisma/client";
import { Button } from "../ui/button";

interface MultiSelectProps {
  //placeholder: string;
  memberRoles: MemberRole[];
  selectedMemberRoles: MemberRole[];
  onMemberRoleChange: (selectedMemberRoles: MemberRole[]) => void;
  loading: boolean;
  action: string;
  setSelected: any;
  handleFinalSelection: () => void;
  selected: MemberRole[];
}

const MultiSelectMemberRole: React.FC<MultiSelectProps> = ({
  //placeholder,
  memberRoles,
  loading,
  setSelected,
  handleFinalSelection,
  selected,
  action,
  onMemberRoleChange,
  selectedMemberRoles: initiallySelectedMemberRoles,
}) => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    if (initiallySelectedMemberRoles.length > 0 && !initialDataLoaded) {
      setSelected(initiallySelectedMemberRoles);
      setInitialDataLoaded(true);
    }
  }, [initiallySelectedMemberRoles, initialDataLoaded]);
  const selectables = memberRoles.filter(
    (memberRole) =>
      !selected.includes(memberRole) &&
      memberRole.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    const index = selected.findIndex((memberRole) => memberRole.id === id);
    if (index !== -1) {
      const updatedSelection = [...selected];
      updatedSelection.splice(index, 1);
      setSelected(updatedSelection);
    } else {
      const memberRoleToAdd = memberRoles.find(
        (memberRole) => memberRole.id === id
      );
      if (memberRoleToAdd) {
        setSelected([...selected, memberRoleToAdd]);
      }
    }
  };

  const onRemove = (id: string) => {
    toggleSelection(id);
  };

  const onChange = (id: string) => {
    toggleSelection(id);
  };

  return (
    <div className="overflow-visible   mt-2 ">
      <div className="flex flex-wrap gap-1  border border-black h-7 rounded-md [&>*]:h-6 ">
        {selected.map((memberRole) => (
          <Badge
            key={memberRole.id}
            defaultValue={memberRole.name}
            className="z-40"
          >
            {memberRole.name}
            <button
              type="button"
              className="ml-1 hover:text-red-1"
              onClick={() => onRemove(memberRole.id)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <input
          className="outline-none z-30  w-full "
          //placeholder={placeholder}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
      </div>

      <div className="relative mt-2 ">
        {open && (
          <div className="absolute w-full z-50 top-0 overflow-auto border rounded-md shadow-md bg-white p-2">
            {selectables.map((memberRole) => (
              <div
                key={memberRole.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onChange(memberRole.id)}
                className="hover:bg-grey-2 cursor-pointer text-sm font-medium leading-"
              >
                {memberRole.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectMemberRole;
