"use client";

import { useUserDataContext } from "@/app/Context/store";
import { db } from "@/firebase";
import { set } from "firebase/database";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
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
  const modalClasses = showModal
    ? "fixed inset-0 flex items-center justify-center"
    : "hidden";
  const { data: session } = useSession();

  useEffect(() => {
    validateForm();
  }, [name, age]);

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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
          const updatedUserData = [...userData!, data];
          setUserData(updatedUserData);
          sessionStorage.setItem("userData", JSON.stringify(updatedUserData));
        }
      });
      setShowModal(false);
    } else {
      console.log("Form is invalid");
    }
  };
  return (
    <div className={`${modalClasses} bg-gray-800 bg-opacity-75`}>
      <div className="bg-white p-8 rounded shadow-lg w-96">
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
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
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
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            name="age"
            id="age"
            required
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="Age"
          />
          {errors.age && (
            <p className="text-red-500 text-xs italic">{errors.age}</p>
          )}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6"
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProfileForm;
