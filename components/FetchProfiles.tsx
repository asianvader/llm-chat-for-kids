"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { SparklesIcon } from "@heroicons/react/24/solid";
import { DocumentData } from "firebase/firestore";
import AddProfileButton from "./AddProfileButton";
import AddProfileForm from "./AddProfileForm";
import { fetchProfileData } from "@/app/utils/getProfiles";
import { useUserDataContext } from "@/app/Context/store";

export default function FetchProfiles() {
  const { userData, setUserData } = useUserDataContext();
  const { data: session } = useSession(); const router = useRouter();
  const [loading, setLoading] = useState(true); const [showModal, setShowModal] = useState(false);
  useEffect(() => { if (!session) return; fetchProfileData(session).then((data) => { const profiles = data && !data.empty ? data.docs.map((doc) => doc.data()) : null; setUserData(profiles); if (profiles) sessionStorage.setItem("userData", JSON.stringify(profiles)); setLoading(false); }); }, [session, setUserData]);
  const openProfile = (profile: DocumentData) => { sessionStorage.setItem("selectedProfile", JSON.stringify(profile)); router.push(`/profile/${profile.id}`); };
  return <div className="roby-shell py-7 sm:py-10"><header className="mb-9 flex items-center justify-between gap-4"><div><p className="font-extrabold uppercase tracking-[.14em] text-[#2daea0]">Roby&apos;s clubhouse</p><h1 className="mt-1 text-3xl font-black sm:text-4xl">Who&apos;s ready to explore?</h1></div><div className="hidden rounded-full bg-white px-4 py-2 text-sm font-bold text-[var(--muted-ink)] shadow-sm sm:block">Choose your picture to begin</div></header>{loading ? <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1,2,3].map((item) => <div key={item} className="roby-card animate-pulse p-6"><div className="mx-auto h-32 w-32 rounded-full bg-[#eaf3f8]" /><div className="mx-auto mt-5 h-6 w-2/3 rounded-full bg-[#eaf3f8]" /></div>)}</div> : userData?.length ? <><div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">{userData.map((profile: DocumentData) => <button key={profile.id} onClick={() => openProfile(profile)} className="profile-card roby-card group flex min-h-[17rem] flex-col items-center justify-center p-6 text-center transition duration-200 hover:-translate-y-1 hover:border-[#8cc5ed] hover:shadow-xl"><span className="rounded-full bg-[#e4f5ff] p-3 shadow-inner"><img src={profile.avatarUrl} width={142} height={142} alt="" className="h-32 w-32 rounded-full object-cover" /></span><span className="mt-4 text-3xl font-black">{profile.name}</span><span className="mt-2 rounded-full bg-[#fff5d8] px-3 py-1 text-sm font-extrabold text-[#745c27]">Tap to chat with Roby</span></button>)}</div><AddProfileButton setShowModal={setShowModal} /></> : <section className="roby-card mx-auto max-w-xl p-8 text-center sm:p-12"><div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[#fff0c7]"><SparklesIcon className="h-8 w-8 text-[#e59a18]" /></div><h2 className="mt-5 text-3xl font-black">Let&apos;s make a first profile</h2><p className="mx-auto mt-3 max-w-md font-semibold leading-relaxed text-[var(--muted-ink)]">A grown-up can add a child&apos;s name and age. Then they&apos;ll have their own cheerful spot to chat with Roby.</p><AddProfileButton setShowModal={setShowModal} /></section>}<AddProfileForm showModal={showModal} setShowModal={setShowModal} /></div>;
}
