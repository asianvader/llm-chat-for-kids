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
import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";

function FetchProfiles() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true); // New state for loading indicator
  const { data: session } = useSession();

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

  return (
    <>
      {loading ? (
        <div>Loading...</div>
      ) : userData ? (
        <>
        <h2>Welcome Back! Choose a profile</h2>
        <div>
          {userData.map((profile: any) => (
            <div key={profile.name}>{profile.name}</div>
          ))}
        </div>
        </>
      ) : (
        null
      )}
    </>
  );
}

export default FetchProfiles;
