import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "@/firebase";

export const fetchProfileData = async (session: any) => {
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

    return userProfiles;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
