"use client";
import { useState, useEffect, MouseEvent } from "react";
import Image from "next/image";
import { DocumentData } from "firebase-admin/firestore";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import EditProfileModal from "./EditProfileModal";
import { useUserDataContext } from "@/app/Context/store";

export function EditProfile() {
  // const [userData, setUserData] = useState<DocumentData[] | null>(null);
  const { userData, setUserData } = useUserDataContext();
  const [profile, setProfile] = useState<DocumentData[] | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(userData, "useeffect");
    if (!userData) {
      console.log("saving");
      const data = sessionStorage.getItem("userData");
      console.log(data);
      const profiles = data ? JSON.parse(data) : null;
      setUserData(profiles);
    }
  }, []);

  const editOnClickHandler = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    console.log("Edit button clicked", e.currentTarget.id);

    if (userData) {
      const filteredProfile = userData?.filter(
        (profile) => profile.id === e.currentTarget.id
      );

      console.log(filteredProfile);

      setProfile(filteredProfile);
      setShowEditModal(true);
    }
  };

  const deleteProfileHandler = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    console.log("Delete button clicked", e.currentTarget.id);
    if (userData) {
      const filteredProfile = userData?.filter(
        (profile) => profile.id !== e.currentTarget.id
      );

      console.log(filteredProfile);

      setUserData(filteredProfile);
      sessionStorage.setItem("userData", JSON.stringify(filteredProfile));
    }
  };
  return (
    <div>
      {showEditModal && (
        <EditProfileModal
          showModal={showEditModal}
          user={profile!}
          setShowModal={setShowEditModal}
        />
      )}
      <h2>My kids</h2>
      <div className="grid gap-4">
        {userData?.map((profile, index) => (
          <div
            key={profile.id}
            className="border-2 border-gray-3
              00 shadow rounded-md p-4 max-w-sm w-full mx-auto grid grid-cols-3 justify-items-stretch"
          >
            <div className="justify-self-center">
              <Image
                src={`/avatar${index + 1}.png`}
                width={100}
                height={100}
                alt="avatar"
              />
            </div>
            <div className="grid grid-rows-2">
              <p className="flex items-center justify-center">{profile.name}</p>
              <p className="flex items-center justify-center">
                Age: {profile.age}
              </p>
            </div>
            <div className="grid">
              <button
                id={profile.id}
                onClick={editOnClickHandler}
                className="flex items-center justify-end"
              >
                <PencilIcon className="h-8 w-8 text-gray-800" />
              </button>
              <button
                className="flex items-center justify-end"
                onClick={deleteProfileHandler}
                id={profile.id}
              >
                <TrashIcon className="h-8 w-8 text-red-600" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* )} */}
    </div>
  );
}
