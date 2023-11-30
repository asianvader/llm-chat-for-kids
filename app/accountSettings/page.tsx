import { EditProfile } from "@/components/EditProfile";
import Logout from "@/components/Logout";
import React from "react";

function accountSettings() {
  return (
    <div className="bg-yellow-200 min-h-screen flex flex-col">
      <header className="bg-blue-800 text-white pt-4 pl-5 pb-1 sticky top-0 z-10 flex justify-between shadow-md">
        <h2 className="text-2xl font-semibold">Account Settings</h2>
        <Logout />
      </header>

      <div className="grid grid-cols-1">
        <EditProfile />
      </div>
    </div>
  );
}

export default accountSettings;
