"use client";
import { useState, useEffect, MouseEvent } from "react";
import { DocumentData } from "firebase/firestore";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import EditProfileModal from "./EditProfileModal";
import { useUserDataContext } from "@/app/Context/store";
import CancelProfileModal from "./DeleteProfileModal";

export function EditProfile() {
  const { userData, setUserData } = useUserDataContext();
  const [profile, setProfile] = useState<DocumentData[] | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!userData) {
      const data = sessionStorage.getItem("userData");
      console.log(data);
      const profiles = data ? JSON.parse(data) : null;
      setUserData(profiles);
      console.log(userData, "useeffect");
    }
  }, []);

  /**
   * Handles the click event when the edit button is clicked.
   * @param e The mouse event object.
   */
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

  /**
   * Handles the delete profile action.
   * @param e - The mouse event object.
   */
  const deleteProfileHandler = (
    e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>
  ) => {
    console.log("Delete button clicked", e.currentTarget.id);
    if (userData) {
      const filteredProfile = userData?.filter(
        (profile) => profile.id === e.currentTarget.id
      );
      setProfile(filteredProfile);
      setShowDeleteModal(true);
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
      {showDeleteModal && (
        <CancelProfileModal
          showDeleteModal={showDeleteModal}
          user={profile!}
          setShowDeleteModal={setShowDeleteModal}
        />
      )}

      {userData?.length! > 0 ? (
        <h2 className="mt-8 text-center text-3xl font-black sm:text-4xl">Your kids</h2>
      ) : null}

      <div className="mx-auto mt-6 grid max-w-2xl gap-4">
        {userData?.map((profile, index) => (
          <div
            key={profile.id}
            className="roby-card grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 p-4 sm:p-5"
          >
            <div className="justify-self-center">
              <img
                src={profile.avatarUrl}
                width={76}
                height={76}
                alt={`${profile.name}'s avatar`}
                className="h-16 w-16 rounded-full bg-[#e4f5ff] sm:h-20 sm:w-20"
              />
            </div>
            <div>
              <p className="text-xl font-black">{profile.name}</p>
              <p className="mt-1 font-bold text-[var(--muted-ink)]">Age {profile.age}</p>
            </div>
            <div className="flex gap-1">
              <button
                id={profile.id}
                onClick={editOnClickHandler}
                className="roby-icon-button"
                aria-label={`Edit ${profile.name}'s profile`}
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                className="roby-icon-button text-[#c64d47] hover:bg-[#fff0ee]"
                onClick={deleteProfileHandler}
                id={profile.id}
                aria-label={`Delete ${profile.name}'s profile`}
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* )} */}
    </div>
  );
}
