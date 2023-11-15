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

function FetchProfiles() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true); // New state for loading indicator
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

  const cardClickHandler = (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => {
    console.log(e.currentTarget);
    const profileId = (e.target as HTMLDivElement).dataset.profileId;
    console.log(profileId);
    router.push(`/profile/${profileId}`);

  }
  return (
    <>
      {loading ? (
        <div>Loading...</div>
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
        </div>
      ) : null}
    </>
  );
}

export default FetchProfiles;