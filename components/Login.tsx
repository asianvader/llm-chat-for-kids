"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Login() {
  return (
    <div className="bg-yellow-200/80 h-screen flex flex-col items-center justify-center text-center">
      <Image
        src="/roby.png"
        width={324}
        height={441}
        alt="a cartoon image of a robot"
      />
      <p className="font-bold text-3xl mt-10">
        Hey there! <br /> Please ask your parent to sign in.
      </p>

      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-10 text-2xl"
        onClick={() => signIn("google")}
      >
        Sign in with your Google account
      </button>
    </div>
  );
}
