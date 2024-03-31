import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { Group, Member } from "@prisma/client";
import { Button } from "../ui/button";

interface MultiSelectProps {
  placeholder: string;
  members: Member[];
  selectedMembers: Member[];
  onMemberChange: (selectedMembers: Member[]) => void;
  loading: boolean;
  action: string;
  setSelected: any;
  handleFinalSelection: () => void;
  selected: Member[];
}

const MultiSelectMember: React.FC<MultiSelectProps> = ({
  placeholder,
  members,
  loading,
  setSelected,
  handleFinalSelection,
  selected,
  action,
  onMemberChange,
  selectedMembers: initiallySelectedMembers,
}) => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    if (initiallySelectedMembers.length > 0 && !initialDataLoaded) {
      setSelected(initiallySelectedMembers);
      setInitialDataLoaded(true);
    }
  }, [initiallySelectedMembers, initialDataLoaded]);
  const selectables = members.filter(
    (member) =>
      !selected.includes(member) &&
      member.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    const index = selected.findIndex((member) => member.id === id);
    if (index !== -1) {
      const updatedSelection = [...selected];
      updatedSelection.splice(index, 1);
      setSelected(updatedSelection);
    } else {
      const memberToAdd = members.find((member) => member.id === id);
      if (memberToAdd) {
        setSelected([...selected, memberToAdd]);
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
    <div className="overflow-visible bg-white">
      <div className="flex gap-1 flex-wrap border rounded-md">
        {selected.map((member) => (
          <Badge key={member.id} defaultValue={member.name}>
            {member.name}
            <button
              type="button"
              className="ml-1 hover:text-red-1"
              onClick={() => onRemove(member.id)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <input
          className="outline-none"
          placeholder={placeholder}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
      </div>

      <div className="relative mt-2">
        {open && (
          <div className="absolute w-full z-30 top-0 overflow-auto border rounded-md shadow-md">
            {selectables.map((member) => (
              <div
                key={member.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onChange(member.id)}
                className="hover:bg-grey-2 cursor-pointer"
              >
                {member.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectMember;
