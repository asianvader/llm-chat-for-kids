"use client";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "@/firebase";
import { useState, useEffect, use, MouseEvent } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AddProfileButton from "./AddProfileButton";

function FetchProfiles() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hideEl, setHideEl] = useState("md:hidden");
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log(session);
    const fetchData = async () => {
      try {
        const profilesCollectionRef = collection(
          db,
          "users",
          session?.user?.email!,
          "profiles"
        );
        const orderedQuery = query(
          profilesCollectionRef,
          orderBy("createdAt", "asc")
        );
        const userProfiles = await getDocs(orderedQuery);
        console.log(userProfiles);

        if (!userProfiles.empty) {
          console.log("User has profiles");
          const profileDetails = userProfiles.docs.map((doc) => doc.data());
          console.log(profileDetails);
          setUserData(profileDetails);
        } else {
          console.log("No profiles");
          setUserData(null);
          setHideEl("");
        }

        // Set loading to false after data is fetched
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set loading to false on error
        setLoading(false);
      }
    };
    fetchData();
  }, [session]);

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
          <div className="grid grid-cols-3 gap-10 ml-10 mr-10 place-items-center">
            {userData.map((profile: any, index: number) => (
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
          <AddProfileButton />
        </div>
      ) : (
        <div className={`pt-8 ${hideEl}`}>
          <h2 className="p-5 text-center font-bold text-5xl">Welcome!</h2>
          <p className="mb-5 text-center font-bold text-3xl">
            Please create a profile
          </p>
          <AddProfileButton />
        </div>
      )}
    </div>
  );
}

export default FetchProfiles;
