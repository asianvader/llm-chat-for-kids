"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";

export default function Login() {
  return (
    <main className="roby-page flex min-h-screen items-center justify-center px-5 py-8"><section className="roby-card grid w-full max-w-4xl overflow-hidden md:grid-cols-[1fr_1.15fr]"><div className="flex min-h-[19rem] items-end justify-center bg-[#d9f1ff] px-8 pt-8"><Image src="/roby.png" width={260} height={354} priority alt="Roby, a friendly cartoon robot, waves hello" className="max-h-[22rem] w-auto object-contain" /></div><div className="flex flex-col justify-center p-8 text-center sm:p-12 md:text-left"><p className="mb-3 font-extrabold uppercase tracking-[.16em] text-[#2daea0]">Welcome to Roby</p><h1 className="text-4xl font-black leading-tight sm:text-5xl">A bright little place for big questions.</h1><p className="mt-5 text-lg font-semibold leading-relaxed text-[var(--muted-ink)]">Roby is ready to explore, explain, and imagine with your child.</p><div className="mt-8 rounded-2xl bg-[#fff5d8] p-4 text-sm font-bold leading-relaxed text-[#66532a]">Grown-ups, please sign in to create and manage child profiles.</div><button className="roby-button roby-button-primary mt-7 w-full sm:w-fit" onClick={() => signIn("google")}>Continue with Google</button></div></section></main>
  );
}
