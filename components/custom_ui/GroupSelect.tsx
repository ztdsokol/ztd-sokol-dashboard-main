import { useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { X } from "lucide-react";
import { Group } from "@prisma/client";
import { Button } from "../ui/button";

interface MultiSelectProps {
  //placeholder: string;
  groups: Group[];
  selectedGroups: Group[];
  onGroupChange: (selectedGroups: Group[]) => void;
  loading: boolean;
  action: string;
  setSelected: any;
  handleFinalSelection: () => void;
  selected: Group[];
}

const MultiSelectGroup: React.FC<MultiSelectProps> = ({
  //placeholder,
  groups,
  loading,
  setSelected,
  handleFinalSelection,
  selected,
  action,
  selectedGroups: initiallySelectedGroups,
}) => {
  const [open, setOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);

  useEffect(() => {
    if (initiallySelectedGroups.length > 0 && !initialDataLoaded) {
      setSelected(initiallySelectedGroups);
      setInitialDataLoaded(true);
    }
  }, [initiallySelectedGroups, initialDataLoaded]);
  const selectables = groups.filter(
    (group) =>
      !selected.includes(group) &&
      group.name.toLowerCase().includes(searchInput.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    const index = selected.findIndex((group) => group.id === id);
    if (index !== -1) {
      const updatedSelection = [...selected];
      updatedSelection.splice(index, 1);
      setSelected(updatedSelection);
    } else {
      const groupToAdd = groups.find((group) => group.id === id);
      if (groupToAdd) {
        setSelected([...selected, groupToAdd]);
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
        {selected.map((group) => (
          <Badge
            key={group.id}
            defaultValue={group.name}
            className="z-40 relative top-10"
          >
            {group.name}
            <button
              type="button"
              className="ml-1 hover:text-red-1"
              onClick={() => onRemove(group.id)}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}

        <input
          className="outline-none z-30   w-full"
          //placeholder={placeholder}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onBlur={() => setOpen(false)}
          onFocus={() => setOpen(true)}
        />
      </div>

      <div className="relative mt-2 ">
        {open && (
          <div className="absolute w-full z-50 top-0 overflow-auto  rounded-md shadow-md bg-white p-2">
            {selectables.map((group) => (
              <div
                key={group.id}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onChange(group.id)}
                className="hover:bg-grey-2 cursor-pointer text-sm font-medium leading-"
              >
                {group.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MultiSelectGroup;
