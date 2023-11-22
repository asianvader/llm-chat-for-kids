"use client";
import { FC, useEffect } from "react";
import { db } from "@/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { DocumentData } from "firebase-admin/firestore";
import { useUserDataContext } from "@/app/Context/store";
import { XMarkIcon } from "@heroicons/react/24/solid";

type DeleteProfileModalProps = {
  user: DocumentData[];
  showDeleteModal: boolean;
  setShowDeleteModal: (showModal: boolean) => void;
};

const DeleteProfileModal: FC<DeleteProfileModalProps> = ({
  user,
  showDeleteModal,
  setShowDeleteModal,
}) => {
  const { userData, setUserData } = useUserDataContext();
  const profile = user[0];
  const { data: session } = useSession();
  const modalClasses = showDeleteModal
    ? "fixed inset-0 flex items-center justify-center"
    : "hidden";

  useEffect(() => {
    // Attach the event listener when the modal is shown
    if (showDeleteModal) {
      document.addEventListener("click", closeModalOnOverlayClick);
    }

    // Detach the event listener when the modal is hidden or component unmounts
    return () => {
      document.removeEventListener("click", closeModalOnOverlayClick);
    };
  }, [showDeleteModal]);

  /**
   * Closes the delete profile modal when the overlay is clicked.
   * @param {MouseEvent} e - The click event.
   */
  const closeModalOnOverlayClick = (e: MouseEvent) => {
    // Check if the click event is on the overlay
    if ((e.target as HTMLDivElement).classList.contains("bg-gray-800")) {
      setShowDeleteModal(false);
    }
  };

  /**
   * Handles the confirmation of profile deletion.
   * Deletes the profile document from the database and updates the user data.
   */
  const confirmDeleteHandler = async () => {
    console.log("Delete button clicked", profile.id);
    if (profile) {
      const profileRef = doc(
        db,
        "users",
        session?.user?.email!,
        "profiles",
        profile.id
      );
      await deleteDoc(profileRef)
        .then(() => {
          console.log("Document successfully deleted!");
          if (userData) {
            const updatedUserData = userData?.filter(
              (user) => profile.id !== user.id
            );
            setUserData(updatedUserData);
            sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
            setShowDeleteModal(false);
          }
        })
        .catch((error) => {
          console.error("Error removing document: ", error);
        });
    }
  };

  return (
    <div className={`${modalClasses} bg-gray-800 bg-opacity-75`}>
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="relative">
          <button
            className="absolute top-0 right-0"
            onClick={() => {
              setShowDeleteModal(false);
            }}
          >
            {" "}
            <XMarkIcon className="h-10 w-10 text-red-600 hover:text-red-600/80" />
          </button>
        </div>
        <div className="mt-12 mb-10 mr-10">
          <p className="font-semibold text-lg">
            Are you sure you want to delete {profile.name}'s profile?
          </p>
        </div>
        <div className="flex justify-center">
          <button
            className="bg-red-600 hover:bg-red-600/80 text-white font-bold rounded px-4 py-2 mr-2"
            onClick={confirmDeleteHandler}
          >
            Yes
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-600/80 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setShowDeleteModal(false);
            }}
          >
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfileModal;
