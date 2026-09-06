"use client";
import { FC, MouseEvent as ReactMouseEvent, useEffect } from "react";
import { db } from "@/firebase";
import { doc, deleteDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { DocumentData } from "firebase/firestore";
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
  const modalClasses = showDeleteModal ? "modal-overlay" : "hidden";

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowDeleteModal(false);
    };
    if (showDeleteModal) document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showDeleteModal, setShowDeleteModal]);

  /**
   * Closes the delete profile modal when the overlay is clicked.
   * @param {MouseEvent} e - The click event.
   */
  const closeModalOnOverlayClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    // Check if the click event is on the overlay
    if ((e.target as HTMLDivElement).classList.contains("modal-overlay")) {
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
    <div className={modalClasses} role="presentation" onMouseDown={closeModalOnOverlayClick}>
      <div className="roby-card w-full max-w-md p-6 sm:p-8" role="dialog" aria-modal="true">
        <div className="relative">
          <button
            className="roby-icon-button absolute right-0 top-0"
            aria-label="Close"
            onClick={() => {
              setShowDeleteModal(false);
            }}
          >
            {" "}
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="mb-8 mt-10">
          <p className="text-lg font-bold">
            Are you sure you want to delete {profile.name}&apos;s profile?
          </p>
        </div>
        <div className="flex justify-end gap-3">
          <button
            className="roby-button roby-button-coral"
            onClick={confirmDeleteHandler}
          >
            Delete profile
          </button>
          <button
            className="roby-button roby-button-quiet"
            onClick={() => {
              setShowDeleteModal(false);
            }}
          >
            Keep it
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProfileModal;
