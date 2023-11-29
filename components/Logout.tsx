"use client";

import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";

function Logout() {

  return (
    <div className="relative">
      <button
        onClick={() => signOut({ callbackUrl: "/"})}
        className="absolute bottom-0 left-0"
        aria-label="Log out"
      >
        <ArrowLeftOnRectangleIcon className="h-14 w-14 text-gray-800 hover:text-gray-600" />
      </button>
    </div>
  );
}

export default Logout;
