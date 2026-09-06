"use client";
import { useUserDataContext } from "@/app/Context/store";
import { db } from "@/firebase";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { FC, FormEvent, useEffect, useRef, useState } from "react";

type Props = { setShowModal: (showModal: boolean) => void; showModal: boolean };
const AddProfileForm: FC<Props> = ({ setShowModal, showModal }) => {
  const { userData, setUserData } = useUserDataContext(); const { data: session } = useSession();
  const [name, setName] = useState(""); const [age, setAge] = useState(""); const [submitted, setSubmitted] = useState(false); const nameRef = useRef<HTMLInputElement>(null);
  const errors = { name: !name.trim() ? "Please enter a first name." : "", age: !age ? "Please enter an age." : !/^\d+$/.test(age) ? "Age needs to be a number." : "" };
  const close = () => { setShowModal(false); setName(""); setAge(""); setSubmitted(false); };
  useEffect(() => { if (!showModal) return; nameRef.current?.focus(); const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") close(); }; document.addEventListener("keydown", onKeyDown); return () => document.removeEventListener("keydown", onKeyDown); }, [showModal]);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); setSubmitted(true); if (errors.name || errors.age || !session?.user?.email) return; const documentRef = await addDoc(collection(db, "users", session.user.email, "profiles"), { name: name.trim(), age, createdAt: serverTimestamp() }); const profileRef = doc(db, "users", session.user.email, "profiles", documentRef.id); await updateDoc(profileRef, { id: documentRef.id, avatarUrl: `https://api.dicebear.com/7.x/thumbs/svg?seed=${encodeURIComponent(name.trim())}` }); const snapshot = await getDoc(profileRef); if (snapshot.exists()) { const next = [...(userData ?? []), snapshot.data()]; setUserData(next); sessionStorage.setItem("userData", JSON.stringify(next)); } close(); };
  if (!showModal) return null;
  return <div className="modal-overlay" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}><section role="dialog" aria-modal="true" aria-labelledby="add-profile-title" className="roby-card w-full max-w-md p-6 sm:p-8"><div className="flex items-start justify-between gap-4"><div><p className="font-extrabold uppercase tracking-[.14em] text-[#2daea0]">Grown-up zone</p><h2 id="add-profile-title" className="mt-1 text-2xl font-black">Add a child profile</h2></div><button className="roby-icon-button" aria-label="Close" onClick={close}><XMarkIcon className="h-6 w-6" /></button></div><form className="mt-6 space-y-4" onSubmit={handleSubmit}><div><label className="mb-2 block text-sm font-extrabold" htmlFor="new-profile-name">First name</label><input ref={nameRef} className="roby-input" id="new-profile-name" value={name} onChange={(event) => setName(event.target.value)} placeholder="e.g. Sam" aria-invalid={submitted && !!errors.name} />{submitted && errors.name && <p className="mt-1 text-sm font-bold text-red-600">{errors.name}</p>}</div><div><label className="mb-2 block text-sm font-extrabold" htmlFor="new-profile-age">Age</label><input className="roby-input" id="new-profile-age" inputMode="numeric" value={age} onChange={(event) => setAge(event.target.value)} placeholder="e.g. 8" aria-invalid={submitted && !!errors.age} />{submitted && errors.age && <p className="mt-1 text-sm font-bold text-red-600">{errors.age}</p>}</div><div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end"><button type="button" className="roby-button roby-button-quiet" onClick={close}>Cancel</button><button className="roby-button roby-button-primary" type="submit">Create profile</button></div></form></section></div>;
};
export default AddProfileForm;
