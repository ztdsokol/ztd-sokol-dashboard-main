import React from "react";
import MemberRolePage from "../member_roles/page";
import ProgramsPage from "../programi/page";
import LocationsPage from "../lokacije/page";

const Settings = () => {
  return (
    <div className="w-full">
      <MemberRolePage />
      <LocationsPage />
      <ProgramsPage />
    </div>
  );
};

export default Settings;
