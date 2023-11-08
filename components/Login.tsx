'use client';

import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div>
      <h2>Hey there! Please ask your parent to sign in.</h2>
      <p>They'll need to sign in with their Google account.</p>
      <button onClick={() => signIn("google")}>Sign in</button>
    </div>
  )
}
