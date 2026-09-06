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
    <div className="fixed bottom-5 right-5 z-20">
      <button
        className="roby-icon-button bg-white shadow-lg"
        onClick={settingsButtonOnClick}
        aria-label="Settings"
      >
        <Cog6ToothIcon className="h-7 w-7" />
      </button>
    </div>
  );
}

export default SettingsButton;
