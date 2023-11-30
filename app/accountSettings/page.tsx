"use client";

import { EditProfile } from "@/components/EditProfile";
import Logout from "@/components/Logout";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import React from "react";

function accountSettings() {
  const router = useRouter();
  return (
    <div className="bg-yellow-200 min-h-screen flex flex-col">
      <header className="bg-blue-800 text-white pt-4 pl-5 pb-2 sticky top-0 z-10 flex justify-between shadow-md">
        <button aria-label="Navigate back" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-8 w-8 text-white-800 hover:text-gray-400" />
        </button>

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
