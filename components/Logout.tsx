"use client";

import { ArrowLeftOnRectangleIcon } from "@heroicons/react/24/solid";
import { signOut } from "next-auth/react";

function Logout() {
  return (
    <div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        aria-label="Log out"
        className="roby-icon-button text-white hover:bg-white/15"
      >
        <ArrowLeftOnRectangleIcon className="h-6 w-6" />
      </button>
    </div>
  );
}

export default Logout;
