"use client";

import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";

function Logout() {
  return (
    <div className="pr-5">
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        aria-label="Log out"
      >
        <ArrowLeftOnRectangleIcon className="h-10 w-10 text-white-800 hover:text-gray-400" />
      </button>
    </div>
  );
}

export default Logout;
