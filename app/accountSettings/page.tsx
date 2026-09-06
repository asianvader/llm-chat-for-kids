"use client";

import { EditProfile } from "@/components/EditProfile";
import Logout from "@/components/Logout";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import React from "react";

function AccountSettings() {
  const router = useRouter();
  return (
    <main className="roby-page min-h-screen">
      <header className="sticky top-0 z-10 border-b border-white/20 bg-[#2a527d] text-white shadow-md">
        <div className="roby-shell flex min-h-16 items-center justify-between gap-4">
        <button className="roby-icon-button text-white hover:bg-white/15" aria-label="Navigate back" onClick={() => router.back()}>
          <ArrowLeftIcon className="h-6 w-6" />
        </button>
        <h1 className="text-lg font-black sm:text-2xl">Parent settings</h1>
        <Logout />
        </div>
      </header>
      <div className="roby-shell py-8 sm:py-12">
        <p className="text-center font-bold text-[var(--muted-ink)]">Manage the profiles in your family&apos;s clubhouse.</p>
        <EditProfile />
      </div>
    </main>
  );
}

export default AccountSettings;
