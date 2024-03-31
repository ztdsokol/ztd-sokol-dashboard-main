import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { Group, Member } from "@prisma/client";
import { Button } from "../ui/button";

interface MultiSelectProps {
  placeholder: string;
  memberGroups: Group[];
  selectedMemberGroups: Group[];
  onMemberGroupChange: (selectedMemberGroups: Group[]) => void;
  loading: boolean;
  action: string;
  setSelected: any;
  handleFinalSelection: () => void;
  selected: Group[];
}

const MultiSelectMemberGroup: React.FC<MultiSelectProps> = ({
  placeholder,
  memberGroups,
  loading,
  setSelected,
  handleFinalSelection,
  selected,
  action,
  onMemberGroupChange,
  selectedMemberGroups: initiallySelectedMemberGroups,
}) => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    if (initiallySelectedMemberGroups.length > 0 && !initialDataLoaded) {
      setSelected(initiallySelectedMemberGroups);
      setInitialDataLoaded(true);
    }
  }, [initiallySelectedMemberGroups, initialDataLoaded]);
  const selectables = memberGroups.filter(
    (memberGroup) =>
      !selected.includes(memberGroup) &&
      memberGroup.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    const index = selected.findIndex((memberGroup) => memberGroup.id === id);
    if (index !== -1) {
      const updatedSelection = [...selected];
      updatedSelection.splice(index, 1);
      setSelected(updatedSelection);
    } else {
      const memberGroupToAdd = memberGroups.find(
        (memberGroup) => memberGroup.id === id
      );
      if (memberGroupToAdd) {
        setSelected([...selected, memberGroupToAdd]);
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
        {selected.map((memberGroup) => (
          <Badge key={memberGroup.id} defaultValue={memberGroup.name}>
            {memberGroup.name}
            <button
              type="button"
              className="ml-1 hover:text-red-1"
              onClick={() => onRemove(memberGroup.id)}
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
            {selectables.map((memberGroup) => (
              <div
                key={memberGroup.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onChange(memberGroup.id)}
                className="hover:bg-grey-2 cursor-pointer"
              >
                {memberGroup.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectMemberGroup;
