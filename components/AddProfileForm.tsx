"use client";

import { db } from "@/firebase";
import { addDoc, collection, doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function AddProfileForm() {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [errors, setErrors] = useState<formProps>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

  const { data: session } = useSession();
  const router = useRouter();

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

      const profileRef = doc(db, "users", session?.user?.email!, "profiles", document.id);

      updateDoc(profileRef, {
        id: document.id,
      })

      router.push("/");
    } else {
      console.log("Form is invalid");
    }
  };
  return (
    <div className="w-full max-w-xs">
      <form
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        onSubmit={handleSubmit}
      >
        <h2 className="text-xl font-bold mb-6 text-center">Create a profile</h2>
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
  );
}

export default AddProfileForm;
