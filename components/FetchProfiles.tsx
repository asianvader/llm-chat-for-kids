"use client";
import { useState, useEffect, MouseEvent } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AddProfileButton from "./AddProfileButton";
import { fetchProfileData } from "@/app/utils/getProfiles";
import { useUserDataContext } from "@/app/Context/store";
import { DocumentData } from "firebase-admin/firestore";
import AddProfileForm from "./AddProfileForm";

function FetchProfiles() {
  const { userData, setUserData } = useUserDataContext();
  const [loading, setLoading] = useState(true);
  const [hideEl, setHideEl] = useState("hidden");
  const { data: session } = useSession();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [gridColsClass, setGridColsClass] = useState("");

  useEffect(() => {
    if (session) {
      fetchProfileData(session).then((data) => {
        console.log("fetching...");
        if (data && !data.empty) {
          const profileDetails = data.docs.map((doc) => doc.data());
          console.log(profileDetails);
          setUserData(profileDetails);

          sessionStorage.setItem("userData", JSON.stringify(profileDetails));
        } else {
          console.log("No profiles");
          setUserData(null);
          setHideEl("");
        }

        // Set loading to false after data is fetched
        setLoading(false);
      });
    }
  }, [session]);

  useEffect(() => {
    if (userData?.length === 1) {
      setGridColsClass("grid-cols-1");
    } else if (userData?.length === 2) {
      console.log("2");
      setGridColsClass("grid-cols-2 sm:grid-cols-1 md:grid-cols-2");
    } else if (userData?.length! >= 2) {
      console.log("3");
      setGridColsClass("grid-cols-3 sm:grid-cols-1 md:grid-cols-3");
    } else {
      setGridColsClass("grid-cols-1");
    }
  }, [userData]);

  /**
   * Handles the click event on a card element.
   * @param e - The mouse event object.
   */
  const cardClickHandler = (
    e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>
  ) => {
    console.log(e.currentTarget);
    const profileId = (e.target as HTMLDivElement).dataset.profileId;
    console.log(profileId);
    router.push(`/profile/${profileId}`);
  };
  return (
    <div className="">
      {loading ? (
        <div className="pt-32">
          <div className="border border-blue-300 shadow rounded-md p-4 max-w-sm w-full mx-auto">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-slate-200 h-10 w-10"></div>
              <div className="flex-1 space-y-6 py-1">
                <div className="h-2 bg-slate-200 rounded"></div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-10">
                    <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-1"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-3"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-3"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-3"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-3"></div>
                    <div className="h-2 bg-slate-200 rounded col-span-3"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : userData ? (
        <div className="pt-8">
          <h2 className="p-5 text-center font-bold text-5xl">Welcome Back!</h2>
          <p className="mb-5 text-center font-bold text-3xl">
            Choose a profile
          </p>
          <div
            className={`grid ${gridColsClass} gap-10 ml-10 mr-10 place-items-center`}
          >
            {userData.map((profile: DocumentData, index: number) => (
              <div
                className="text-center border-4 border-zinc-500/50 box-border min-w-fit min-h-fit pt-5 rounded-xl shadow-lg pl-4 pr-4 pb-4 bg-white"
                key={profile.name}
              >
                <div className="grid place-items-center">
                  <Image
                    src={`/avatar${index + 1}.png`}
                    width={160}
                    height={160}
                    alt="avatar"
                    onClick={cardClickHandler}
                    className="cursor-pointer focus:transition-opacity hover:opacity-80"
                    data-profile-id={profile.id}
                  />
                </div>
                <div className="font-bold text-3xl flex-wrap">
                  {profile.name}
                </div>
              </div>
            ))}
          </div>
          <AddProfileButton setShowModal={setShowModal} />
          <AddProfileForm showModal={showModal} setShowModal={setShowModal} />
        </div>
      ) : (
        <div className={`pt-8 ${hideEl}`}>
          <h2 className="p-5 text-center font-bold text-5xl">Welcome!</h2>
          <p className="mb-5 text-center font-bold text-3xl">
            Please create a profile
          </p>
          <AddProfileButton setShowModal={setShowModal} />
          <AddProfileForm showModal={showModal} setShowModal={setShowModal} />
        </div>
      )}
    </div>
  );
}

export default FetchProfiles;
