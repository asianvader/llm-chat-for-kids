"use client";

import { useUserDataContext } from "@/app/Context/store";
import { db } from "@/firebase";
import { XMarkIcon } from "@heroicons/react/24/solid";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FC, FormEvent, useEffect, useState } from "react";

type AddProfileModalProps = {
  setShowModal: (showModal: boolean) => void;
  showModal: boolean;
};

const AddProfileForm: FC<AddProfileModalProps> = ({
  setShowModal,
  showModal,
}) => {
  const { userData, setUserData } = useUserDataContext();
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [errors, setErrors] = useState<formProps>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);
  const [hideEl, setHideEl] = useState("hidden");
  const modalClasses = showModal
    ? "fixed inset-0 flex items-center justify-center"
    : "hidden";
  const { data: session } = useSession();

  useEffect(() => {
    console.log("useeffect");
    validateForm();
  }, [name, age]);

  useEffect(() => {
    // Attach the event listener when the modal is shown
    if (showModal) {
      document.addEventListener("click", closeModalOnOverlayClick);
    }

    // Detach the event listener when the modal is hidden or component unmounts
    return () => {
      document.removeEventListener("click", closeModalOnOverlayClick);
    };
  }, [showModal]);

  /**
   * Closes the modal when the overlay is clicked.
   * @param {MouseEvent} e - The click event.
   */
  const closeModalOnOverlayClick = (e: MouseEvent) => {
    // Check if the click event is on the overlay
    if ((e.target as HTMLDivElement).classList.contains("bg-gray-800")) {
      setShowModal(false);
      setAge("");
      setName("");
      setHideEl("hidden");
    }
  };

  /**
   * Validates the form by checking if the name and age fields are filled out correctly.
   * If there are any errors, they will be stored in the 'errors' state object.
   * If there are no errors, the 'isFormValid' state will be set to true.
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
   * Handles the form submission.
   * 
   * @param e - The form event.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log(e.currentTarget);
    e.preventDefault();
    if (isFormValid) {
      console.log("Form is valid");
      const document = await addDoc(
        collection(db, "users", session?.user?.email!, "profiles"),
        {
          name: name,
          age: age,
          createdAt: serverTimestamp(),
        }
      );

      const profileRef = doc(
        db,
        "users",
        session?.user?.email!,
        "profiles",
        document.id
      );

      updateDoc(profileRef, {
        id: document.id,
      });

      getDoc(profileRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          console.log("Document data:", data);
          if (userData) {
            const updatedUserData = [...userData, data];
            setUserData(updatedUserData);
            sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
          } else {
            console.log("No profiles");
            setUserData([data]);
          }
        }
      });
      setName("");
      setAge("");
      setShowModal(false);
    } else {
      console.log("Form is invalid or cancel");
    }
  };
  return (
    <div className={`${modalClasses} bg-gray-800 bg-opacity-75`}>
      <div className="bg-white p-8 rounded shadow-lg w-96">
        <div className="relative">
          <button
            className="absolute top-0 right-0"
            onClick={() => {
              setShowModal(false);
              setAge("");
              setName("");
              setHideEl("hidden");
            }}
          >
            {" "}
            <XMarkIcon className="h-10 w-10 text-red-600 hover:text-red-600/80" />
          </button>
        </div>

        <form
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          onSubmit={handleSubmit}
        >
          <h2 className="text-xl font-bold mb-6 text-center">
            Create a profile
          </h2>
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="name"
          >
            First name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="name"
            id="name"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setHideEl("");
            }}
            placeholder="Name"
          />
          {errors.name && (
            <p className={`text-red-500 text-xs italic ${hideEl}`}>
              {errors.name}
            </p>
          )}
          <label
            className="block text-gray-700 text-sm font-bold mb-2 mt-2"
            htmlFor="age"
          >
            Age
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="age"
            id="age"
            required
            value={age}
            onChange={(e) => {
              setAge(e.target.value);
              setHideEl("");
            }}
            placeholder="Age"
          />
          {errors.age && (
            <p className={`text-red-500 text-xs italic ${hideEl}`}>
              {errors.age}
            </p>
          )}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6"
            type="submit"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProfileForm;
