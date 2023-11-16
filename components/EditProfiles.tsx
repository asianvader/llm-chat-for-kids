import {
    collection,
    getDocs,
    orderBy,
    query,
  } from "firebase/firestore";
  import { db } from "@/firebase";
  import { useState, useEffect, MouseEvent } from "react";
  import { useSession } from "next-auth/react";
  import Image from "next/image";
  import { useRouter } from "next/navigation";

export function GetProfile() {
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
  
  return (
    <div>EditProfiles</div>
  )
}

export function EditProfile() {
    return (
        <div>EditProfile</div>
    )
    }