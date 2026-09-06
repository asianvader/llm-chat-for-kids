"use client";
import { FC, FormEvent, MouseEvent as ReactMouseEvent, useEffect, useState } from "react";
import { db } from "@/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { DocumentData } from "firebase/firestore";
import { useUserDataContext } from "@/app/Context/store";
import { XMarkIcon } from "@heroicons/react/24/solid";

type EditProfileModalProps = {
  user: DocumentData[];
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
};

const EditProfileModal: FC<EditProfileModalProps> = ({
  user,
  showModal,
  setShowModal,
}) => {
  const { setUserData } = useUserDataContext();
  const [profile, setProfile] = useState<DocumentData>(user[0]);
  const [name, setName] = useState<string>(profile.name);
  const [age, setAge] = useState<string>(profile.age);
  const [errors, setErrors] = useState<formProps>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const { data: session } = useSession();
  const modalClasses = showModal ? "modal-overlay" : "hidden";

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowModal(false);
    };
    if (showModal) document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [showModal, setShowModal]);

  /**
   * Closes the modal when the overlay is clicked.
   * @param {MouseEvent} e - The click event.
   */
  const closeModalOnOverlayClick = (e: ReactMouseEvent<HTMLDivElement>) => {
    // Check if the click event is on the overlay
    if ((e.target as HTMLDivElement).classList.contains("modal-overlay")) {
      setShowModal(false);
    }
  };
  useEffect(() => {
    validateForm();
  }, [name, age]);

  
  /**
   * Validates the form by checking if the name and age fields are filled out correctly.
   * Sets the errors state object and updates the isFormValid state based on the validation results.
   */
  const validateForm = () => {
    let errors: formProps = {};

    if (!name) {
      errors.name = "Name is required";
    }

    if (!age) {
      errors.age = "Age is required";
    } else if (!/^\d+$/.test(age)) {
      errors.age = "Age must be a number";
    }

    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  /**
   * Handles the form submission for editing a user profile.
   * @param {FormEvent<HTMLFormElement>} e - The form event.
   * @returns {Promise<void>} - A promise that resolves when the profile is updated.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Form is valid");
      try {
        const profileRef = doc(
          db,
          "users",
          session?.user?.email!,
          "profiles",
          profile.id
        );

        await updateDoc(profileRef, {
          name: name,
          age: age,
        });

        setProfile({
          ...profile,
          name: name,
          age: age,
        });

        setUserData((userData) => {
          const updatedUserData = userData!.map((user) => {
            if (user.id === profile.id) {
              return {
                ...user,
                name: name,
                age: age,
              };
            } else {
              return user;
            }
          });
          sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
          return updatedUserData;
        });

        setShowModal(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else {
      console.log("Form is invalid");
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
              setShowModal(false);
            }}
          >
            {" "}
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form
          className="pt-8"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-bold mb-6 text-center">
            Edit {profile.name}&apos;s profile
          </h2>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            First name
          </label>
          <input
            className="roby-input"
            type="text"
            name="name"
            id="name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          {errors.name && (
            <p className="text-red-500 text-xs italic">{errors.name}</p>
          )}

          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="age"
          >
            Age
          </label>
          <input
            className="roby-input"
            type="text"
            name="age"
            id="age"
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
          {errors.age && (
            <p className="text-red-500 text-xs italic">{errors.age}</p>
          )}
          <button
            className="roby-button roby-button-primary mt-6"
            type="submit"
          >
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
