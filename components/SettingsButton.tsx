"use client";

import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { MouseEvent } from "react";
import { useRouter } from "next/navigation";

function SettingsButton() {
  const router = useRouter();
  const settingsButtonOnClick = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    router.push("/accountSettings");
  };
  return (
    <div className="relative">
      <button
        className="absolute bottom-0 right-0"
        onClick={settingsButtonOnClick}
        aria-label="Settings"
      >
        <Cog6ToothIcon className="h-14 w-14 text-gray-800 hover:text-gray-600" />
      </button>
    </div>
  );
}

export default SettingsButton;
