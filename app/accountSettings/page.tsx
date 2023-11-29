import { EditProfile } from "@/components/EditProfile";
import Logout from "@/components/Logout";
import React from "react";

function accountSettings() {
  return (
    <div>
      <h2>Account Settings</h2>
      <div className="grid grid-cols-1">
        <EditProfile />
        <Logout />
      </div>
    </div>
  );
}

export default accountSettings;
