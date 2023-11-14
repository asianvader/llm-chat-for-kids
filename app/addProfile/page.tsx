"use client";

import { FormEvent, useEffect, useState } from "react";

type formProps = {
  name?: string;
  age?: string;
};

const AddProfile = () => {
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [errors, setErrors] = useState<formProps>({});
  const [isFormValid, setIsFormValid] = useState<boolean>(false);

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
    }

    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsFormValid(true);
    } else {
      setIsFormValid(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid) {
      console.log("Form is valid");
    } else {
      console.log("Form is invalid");
    }
  };
  return (
    <div>
      <h1>Create a profile</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">First name</label>
        <input
          type="text"
          name="name"
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p>{errors.name}</p>}
        <label htmlFor="age">Age</label>
        <input
          type="text"
          name="age"
          id="age"
          required
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        {errors.age && <p>{errors.age}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddProfile;
